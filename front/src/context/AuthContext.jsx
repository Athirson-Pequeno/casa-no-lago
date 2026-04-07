import { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest } from '../services/auth';

const defaultAuthContext = {
  token: '',
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthProvider nao encontrado.');
  },
  logout: () => {},
};

const AuthContext = createContext(defaultAuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  async function login(credentials) {
    const response = await loginRequest(credentials);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    return response;
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
