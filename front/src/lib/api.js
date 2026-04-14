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

// Redireciona para /login quando o token expira ou é inválido
function handleUnauthorized() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  // Só redireciona se não estiver já na página de login/register
  if (!window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register')) {
    window.location.href = '/login'
  }
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

  // Token expirado ou inválido: limpa sessão e manda para login
  if (res.status === 401) {
    handleUnauthorized()
    return { ok: false, status: 401, data: { msg: 'Sessão expirada. Faça login novamente.' } }
  }

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

// Verifica se o token JWT local ainda está dentro do prazo de validade.
// Evita enviar requisições que já sabemos que vão retornar 401.
export function isTokenValid() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp está em segundos, Date.now() em ms
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function getRole() {
  const token = getToken()
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).role || null
  } catch {
    return null
  }
}
