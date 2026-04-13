// Em produção (Vercel), VITE_API_URL aponta para o Render.
// Em dev local, fica vazio e o proxy do vite.config.js redireciona automaticamente.
const BASE = import.meta.env.VITE_API_URL || ''

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

export const api = {
  get:    (path)        => request(path),
  post:   (path, body)  => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)  => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)        => request(path, { method: 'DELETE' }),
}

export function saveAuth(token, name) {
  if (token) localStorage.setItem('token', token)
  if (name)  localStorage.setItem('userName', name)
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
}

export function getUser() {
  return {
    token: getToken(),
    name:  localStorage.getItem('userName'),
  }
}
