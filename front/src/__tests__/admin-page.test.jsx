import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../App';
import { AuthProvider } from '../context/AuthContext';

function renderApp(route = '/', session) {
  localStorage.clear();

  if (session) {
    localStorage.setItem('token', JSON.stringify(session));
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function replaceText(user, input, value) {
  await user.clear(input);
  await user.type(input, value);
}

const baseRoom = {
  _id: 'quarto-1',
  titulo: 'Cabana Aurora',
  valorDiaria: 420,
  estaAlugado: false,
  diasAlugados: [],
  tags: [],
  fotos: ['https://example.com/aurora.jpg'],
};

describe('admin page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('mostra o link de admin na home para usuarios administradores', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [baseRoom],
      }),
    );

    renderApp('/', {
      token: 'token-admin',
      expiresAt: Date.now() + 60_000,
      role: 'admin',
      name: 'Luiz',
    });

    expect(await screen.findByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('redireciona usuarios nao administradores para a home ao acessar a rota admin', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [baseRoom],
      }),
    );

    renderApp('/admin/quartos', {
      token: 'token-user',
      expiresAt: Date.now() + 60_000,
      role: 'user',
      name: 'Maria',
    });

    expect(await screen.findByRole('heading', { name: /casa do lago/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /painel administrativo/i })).not.toBeInTheDocument();
  });

  it('permite criar, editar e excluir quartos com bearer token no painel admin', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [baseRoom],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: 'quarto-2',
          titulo: 'Retiro das Aguas',
          valorDiaria: 650,
          estaAlugado: false,
          diasAlugados: [],
          tags: [],
          fotos: ['https://example.com/retiro.jpg'],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          baseRoom,
          {
            _id: 'quarto-2',
            titulo: 'Retiro das Aguas',
            valorDiaria: 650,
            estaAlugado: false,
            diasAlugados: [],
            tags: [],
            fotos: ['https://example.com/retiro.jpg'],
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...baseRoom,
          titulo: 'Cabana Aurora Premium',
          valorDiaria: 480,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            ...baseRoom,
            titulo: 'Cabana Aurora Premium',
            valorDiaria: 480,
          },
          {
            _id: 'quarto-2',
            titulo: 'Retiro das Aguas',
            valorDiaria: 650,
            estaAlugado: false,
            diasAlugados: [],
            tags: [],
            fotos: ['https://example.com/retiro.jpg'],
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mensagem: 'Quarto deletado com sucesso.' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            _id: 'quarto-2',
            titulo: 'Retiro das Aguas',
            valorDiaria: 650,
            estaAlugado: false,
            diasAlugados: [],
            tags: [],
            fotos: ['https://example.com/retiro.jpg'],
          },
        ],
      });
    vi.stubGlobal('fetch', fetchMock);

    renderApp('/admin/quartos', {
      token: 'token-admin',
      expiresAt: Date.now() + 60_000,
      role: 'admin',
      name: 'Luiz',
    });

    expect(await screen.findByRole('heading', { name: /painel administrativo/i })).toBeInTheDocument();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/titulo do quarto/i), 'Retiro das Aguas');
    await user.type(screen.getByLabelText(/foto principal/i), 'https://example.com/retiro.jpg');
    await user.type(screen.getByLabelText(/valor da diaria/i), '650');
    await user.click(screen.getByRole('button', { name: /adicionar quarto/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        '/quartos',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-admin',
          }),
          body: JSON.stringify({
            titulo: 'Retiro das Aguas',
            fotos: ['https://example.com/retiro.jpg'],
            valorDiaria: 650,
          }),
        }),
      );
    });

    expect(await screen.findByRole('heading', { name: /retiro das aguas/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /editar cabana aurora/i }));
    await replaceText(user, screen.getByLabelText(/titulo do quarto/i), 'Cabana Aurora Premium');
    await replaceText(user, screen.getByLabelText(/valor da diaria/i), '480');
    await user.click(screen.getByRole('button', { name: /salvar alteracoes/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        4,
        '/quartos/quarto-1',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-admin',
          }),
          body: JSON.stringify({
            titulo: 'Cabana Aurora Premium',
            fotos: ['https://example.com/aurora.jpg'],
            valorDiaria: 480,
          }),
        }),
      );
    });

    expect(
      await screen.findByRole('heading', { name: /cabana aurora premium/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /excluir cabana aurora premium/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        6,
        '/quartos/quarto-1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-admin',
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /cabana aurora premium/i }),
      ).not.toBeInTheDocument();
    });
  });
});
