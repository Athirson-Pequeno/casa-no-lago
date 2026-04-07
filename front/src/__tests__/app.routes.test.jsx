import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../App';

function renderRoute(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza a home na raiz', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    renderRoute('/');
    expect(screen.getByRole('heading', { name: /casa do lago/i })).toBeInTheDocument();
  });

  it('renderiza a tela de login', () => {
    renderRoute('/login');
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renderiza a tela de cadastro', () => {
    renderRoute('/cadastro');
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('renderiza a listagem completa de quartos na rota dedicada', async () => {
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
            tags: [],
            fotos: [],
            createdAt: '2026-04-03T10:00:00.000Z',
          },
        ],
      }),
    );

    renderRoute('/quartos');

    expect(await screen.findByRole('heading', { name: /nossos quartos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cabana aurora/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/check-in/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/check-out/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /buscar disponibilidade/i })).not.toBeInTheDocument();
  });
});
