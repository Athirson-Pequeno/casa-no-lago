import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '../pages/HomePage';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  afterEach(() => {
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
    await user.type(screen.getByLabelText(/check-in/i), '2026-04-12');
    await user.type(screen.getByLabelText(/check-out/i), '2026-04-12');
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

    expect(screen.getByText(/carregando acomodações/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /suite horizonte/i })).toBeInTheDocument();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/check-in/i), '2026-04-12');
    await user.type(screen.getByLabelText(/check-out/i), '2026-04-14');
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
});
