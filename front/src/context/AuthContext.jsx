import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUserRequest, loginRequest } from '../services/auth';

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
  name: '',
  token: '',
  role: '',
  isAdmin: false,
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
      name: response.name || '',
      role: response.role || '',
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

  useEffect(() => {
    let isMounted = true;

    async function syncRole() {
      if (!session?.token || (session.role && session.name)) {
        return;
      }

      try {
        const response = await getCurrentUserRequest(session.token);

        if (!isMounted) {
          return;
        }

        const nextRole = typeof response?.role === 'string' ? response.role : session.role || '';
        const nextName = typeof response?.name === 'string' ? response.name : session.name || '';

        if ((nextRole === (session.role || '')) && (nextName === (session.name || ''))) {
          return;
        }

        const nextSession = {
          ...session,
          role: nextRole,
          name: nextName,
        };

        writeStoredSession(nextSession);
        setSession(nextSession);
      } catch {
        return;
      }
    }

    syncRole();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const value = useMemo(
    () => ({
      name: session?.name || '',
      token: session?.token || '',
      role: session?.role || '',
      isAdmin: session?.role === 'admin',
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
