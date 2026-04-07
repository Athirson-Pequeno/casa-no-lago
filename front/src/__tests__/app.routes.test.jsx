import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../App';

function renderRoute(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('renderiza a home na raiz', () => {
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
});
