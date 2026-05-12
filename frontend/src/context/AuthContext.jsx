import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('banif_token')
    if (!token) {
      setLoading(false)
      return
    }
    api('/perfil')
      .then((res) => setUser({ ...res.data, token }))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await api('/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    })
    setToken(res.data.token)
    const perfil = await api('/perfil')
    setUser({ ...perfil.data, token: res.data.token })
    return perfil.data
  }

  async function logout() {
    try { await api('/logout', { method: 'POST' }) } catch (_) {}
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
