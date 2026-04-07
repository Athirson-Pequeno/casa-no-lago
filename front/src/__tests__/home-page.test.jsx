import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { HomePage } from '../pages/HomePage';

function renderHomePage({ session } = {}) {
  localStorage.clear();

  if (session) {
    localStorage.setItem('token', JSON.stringify(session));
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<div>Pagina de login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function replaceDate(user, input, value) {
  await user.clear(input);
  await user.type(input, value);
}

function buildRoom({
  id,
  title,
  dailyRate = 420,
  available = true,
  bookedDates = [],
  tags = [],
  imageUrl,
  createdAt,
}) {
  return {
    _id: id,
    titulo: title,
    valorDiaria: dailyRate,
    estaAlugado: !available,
    diasAlugados: bookedDates,
    tags: tags.map((tag, index) => ({ _id: `tag-${id}-${index}`, nome: tag })),
    fotos: imageUrl ? [imageUrl] : [],
    createdAt,
  };
}

describe('HomePage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('considera conflito no check-in usando a data de calendario do ISO retornado pela API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: ['2026-04-12T00:00:00.000Z'],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
          {
            _id: 'quarto-2',
            titulo: 'Suite Horizonte',
            valorDiaria: 560,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-2', nome: 'Cafe da manha' }],
            fotos: ['https://example.com/horizonte.jpg'],
          },
        ],
      }),
    );

    renderHomePage();
    expect(await screen.findByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();

    const user = userEvent.setup();
    await replaceDate(user, screen.getByLabelText(/check-in/i), '2026-04-12');
    await replaceDate(user, screen.getByLabelText(/check-out/i), '2026-04-12');
    await user.click(screen.getByRole('button', { name: /buscar disponibilidade/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /cabana aurora/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();
  });

  it('carrega os quartos da API e filtra no cliente por periodo com conflito inclusivo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: ['2026-04-12T00:00:00.000Z', '2026-04-13T00:00:00.000Z'],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
          {
            _id: 'quarto-2',
            titulo: 'Suite Horizonte',
            valorDiaria: 560,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-2', nome: 'Cafe da manha' }],
            fotos: ['https://example.com/horizonte.jpg'],
          },
        ],
      }),
    );

    renderHomePage();
    expect(screen.getByText(/carregando acomodacoes/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();

    const user = userEvent.setup();
    await replaceDate(user, screen.getByLabelText(/check-in/i), '2026-04-12');
    await replaceDate(user, screen.getByLabelText(/check-out/i), '2026-04-14');
    await user.click(screen.getByRole('button', { name: /buscar disponibilidade/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /cabana aurora/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();
  });

  it('mostra a mensagem de erro retornada pelo backend quando a busca falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ erro: 'Erro ao buscar quartos.' }),
      }),
    );

    renderHomePage();
    expect(await screen.findByRole('alert')).toHaveTextContent(/erro ao buscar quartos\./i);
  });

  it('usa um catalogo demonstrativo quando a API nao responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    renderHomePage();

    expect(await screen.findByText(/exibindo um catalogo demonstrativo/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();
  });

  it('mantem a estrutura editorial da home original', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
        ],
      }),
    );

    renderHomePage();

    expect(screen.getByRole('link', { name: /casa do lago/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^quartos$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^sobre$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^contato$/i })).toBeInTheDocument();
    expect(screen.getByText(/bem-vindo a sua estadia/i)).toBeInTheDocument();
    expect(screen.getByText(/^tipo$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in/i)).toHaveValue('');
    expect(screen.getByLabelText(/check-out/i)).toHaveValue('');
    expect(screen.getByRole('heading', { name: /nossos quartos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver todos/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();
    expect(screen.getByText(/^quartos$/i, { selector: '.stat-label' })).toBeInTheDocument();
    expect(screen.getByText(/^disponiveis$/i, { selector: '.stat-label' })).toBeInTheDocument();
    expect(screen.getByText(/^reservados$/i, { selector: '.stat-label' })).toBeInTheDocument();
  });

  it('mostra na home no maximo tres quartos mais recentes e envia o usuario para a listagem completa', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          buildRoom({
            id: 'quarto-1',
            title: 'Cabana Aurora',
            createdAt: '2026-04-01T10:00:00.000Z',
          }),
          buildRoom({
            id: 'quarto-2',
            title: 'Suite Horizonte',
            createdAt: '2026-04-02T10:00:00.000Z',
          }),
          buildRoom({
            id: 'quarto-3',
            title: 'Retiro das Aguas',
            createdAt: '2026-04-03T10:00:00.000Z',
          }),
          buildRoom({
            id: 'quarto-4',
            title: 'Cabana do Bosque',
            createdAt: '2026-04-04T10:00:00.000Z',
          }),
        ],
      }),
    );

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quartos" element={<div>Pagina completa de quartos</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(await screen.findByRole('heading', { name: /cabana do bosque/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /retiro das aguas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /cabana aurora/i })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /ver todos/i }));

    expect(await screen.findByText(/pagina completa de quartos/i)).toBeInTheDocument();
  });

  it('mostra a saudacao com o nome do usuario autenticado no header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          buildRoom({
            id: 'quarto-1',
            title: 'Cabana Aurora',
          }),
        ],
      }),
    );

    renderHomePage({
      session: {
        token: 'token-123',
        expiresAt: Date.now() + 60_000,
        role: 'user',
        name: 'Luiz',
      },
    });

    expect(await screen.findByText(/ola, luiz/i)).toBeInTheDocument();
  });

  it('abre o seletor de tipo em um dropdown customizado na busca da home', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          buildRoom({
            id: 'quarto-1',
            title: 'Cabana Aurora',
          }),
        ],
      }),
    );

    renderHomePage();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /todos os quartos/i }));

    expect(screen.getByRole('listbox', { name: /tipo de quarto/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /todos os quartos/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /standard/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /luxo/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /suite/i })).toBeInTheDocument();
  });

  it('redireciona para o login quando um usuario nao autenticado tenta reservar', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
        ],
      }),
    );

    renderHomePage();

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /reservar cabana aurora/i }));
    expect(await screen.findByText(/pagina de login/i)).toBeInTheDocument();
  });

  it('abre e fecha o modal de reserva para usuario autenticado', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
        ],
      }),
    );

    renderHomePage({
      session: {
        token: 'token-123',
        expiresAt: Date.now() + 60_000,
        role: 'user',
        name: 'Luiz',
      },
    });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /reservar cabana aurora/i }));

    const dialog = await screen.findByRole('dialog', { name: /reservar cabana aurora/i });
    expect(within(dialog).getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/check-out/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /reservar cabana aurora/i })).not.toBeInTheDocument();
    });
  });

  it('envia a reserva autenticada com bearer token e mostra sucesso', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-1',
            titulo: 'Cabana Aurora',
            valorDiaria: 420,
            estaAlugado: false,
            diasAlugados: [],
            tags: [{ _id: 'tag-1', nome: 'Vista para o lago' }],
            fotos: ['https://example.com/aurora.jpg'],
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'reserva-1' }),
      });
    vi.stubGlobal('fetch', fetchMock);

    renderHomePage({
      session: {
        token: 'token-123',
        expiresAt: Date.now() + 60_000,
        role: 'user',
        name: 'Luiz',
      },
    });

    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /reservar cabana aurora/i }));

    const dialog = await screen.findByRole('dialog', { name: /reservar cabana aurora/i });
    await replaceDate(user, within(dialog).getByLabelText(/check-in/i), '2026-04-20');
    await replaceDate(user, within(dialog).getByLabelText(/check-out/i), '2026-04-22');
    await user.click(within(dialog).getByRole('button', { name: /confirmar reserva/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        '/reservas',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token-123',
          }),
          body: JSON.stringify({
            quartoId: 'quarto-1',
            diaria: {
              dataInicio: '2026-04-20',
              dataFim: '2026-04-22',
            },
          }),
        }),
      );
    });

    expect(await screen.findByText(/reserva criada com sucesso/i)).toBeInTheDocument();
  });
});
