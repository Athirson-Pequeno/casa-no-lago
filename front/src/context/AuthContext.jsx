import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest } from '../services/auth';

const AUTH_STORAGE_KEY = 'token';

function readStoredSession() {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession);

    if (
      typeof session?.token !== 'string' ||
      typeof session?.expiresAt !== 'number' ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function hasValidStoredSession() {
  return Boolean(readStoredSession());
}

function writeStoredSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

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
  const [session, setSession] = useState(() => readStoredSession());

  async function login(credentials) {
    const response = await loginRequest(credentials);

    const nextSession = {
      token: response.token,
      expiresAt: Date.now() + Number(response.expiredAt) * 1000,
    };

    writeStoredSession(nextSession);
    setSession(nextSession);
    return response;
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const timeoutMs = session.expiresAt - Date.now();

    if (timeoutMs <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [session]);

  const value = useMemo(
    () => ({
      token: session?.token || '',
      isAuthenticated: Boolean(session?.token) && session.expiresAt > Date.now(),
      login,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
