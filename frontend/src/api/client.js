const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1'

function getToken() {
  return localStorage.getItem('banif_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('banif_token', token)
  else localStorage.removeItem('banif_token')
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let json = null
  try { json = await response.json() } catch (_) {}

  if (!response.ok) {
    const message = json?.message || `Erro ${response.status}`
    const err = new Error(message)
    err.status = response.status
    err.payload = json
    throw err
  }
  return json
}
