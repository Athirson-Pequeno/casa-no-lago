import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

function renderAuth(route = '/login') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/" element={<div>Pagina inicial</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('auth pages', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('faz login, salva o token e redireciona para a home', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'token-123', msg: 'ok' }),
      }),
    );

    renderAuth('/login');
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), 'teste@casa.com');
    await user.type(screen.getByLabelText(/senha/i), '123456');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('token-123');
    });
    expect(await screen.findByText(/pagina inicial/i)).toBeInTheDocument();
  });

  it('envia o payload esperado no cadastro e navega para login', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ msg: 'Usuario criado com sucesso.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    renderAuth('/cadastro');
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^nome$/i), 'Maria');
    await user.type(screen.getByLabelText(/e-mail/i), 'maria@casa.com');
    await user.type(screen.getByLabelText(/^senha$/i), '123456');
    await user.type(screen.getByLabelText(/confirmar senha/i), '123456');
    await user.type(screen.getByLabelText(/telefone/i), '11999999999');
    await user.type(screen.getByLabelText(/cpf/i), '12345678901');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Maria',
            email: 'maria@casa.com',
            password: '123456',
            confirmpassword: '123456',
            telefone: '11999999999',
            cpf: '12345678901',
          }),
        }),
      );
    });
    expect(await screen.findByRole('heading', { name: /entrar/i })).toBeInTheDocument();
  });

  it('restaura a sessao a partir do localStorage', async () => {
    localStorage.setItem('token', 'token-restaurado');

    renderAuth('/login');

    await waitFor(() => {
      expect(screen.getByText(/pagina inicial/i)).toBeInTheDocument();
    });
  });
});
