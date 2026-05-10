// ============================================================
// AuthContext.tsx
// Gerencia autenticação com a API AdonisJS.
// Persiste token + user no localStorage.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import * as api from './api/api'

// ---------- tipos ----------

export interface AuthUser {
  id: string
  nome: string
  regra: 'gerente' | 'cliente' | null   // preenchido após /perfil
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<{ ok: boolean; message: string }>
  logout: () => void
  refreshPerfil: () => Promise<void>
}

// ---------- context ----------

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

// ---------- provider ----------

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken]     = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser]       = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoading, setIsLoading] = useState<boolean>(!!localStorage.getItem('token'))

  // Busca /perfil e enriquece o usuário com regra + email
  const refreshPerfil = useCallback(async () => {
    const res = await api.getPerfil()

    if (res.status === 'success') {
      setUser((prev) => {
        if (!prev) return prev
        const updated: AuthUser = {
          ...prev,
          regra:  res.data.regra,
          email:  res.data.email,
        }
        localStorage.setItem('user', JSON.stringify(updated))
        return updated
      })
    } else {
      // Sessão expirada
      logout()
    }
  }, [])

  // Na montagem, se houver token salvo valida a sessão
  useEffect(() => {
    if (token) {
      setIsLoading(true)
      refreshPerfil().finally(() => setIsLoading(false))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- login ----------

  const login = useCallback(
    async (email: string, senha: string): Promise<{ ok: boolean; message: string }> => {
      const res = await api.login({ email, senha })

      if (res.status === 'success') {
        const { token: newToken, user: apiUser } = res.data

        // Persiste token
        localStorage.setItem('token', newToken)
        setToken(newToken)

        // Cria usuário base (regra virá de /perfil)
        const baseUser: AuthUser = {
          id:    String(apiUser.id),
          nome:  apiUser.nome,
          regra: null,
          email: '',
        }
        localStorage.setItem('user', JSON.stringify(baseUser))
        setUser(baseUser)

        // Busca perfil completo (regra + email + conta)
        await refreshPerfil()

        return { ok: true, message: res.message ?? 'Acesso liberado!' }
      }

      return { ok: false, message: res.message }
    },
    [refreshPerfil],
  )

  // ---------- logout ----------

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}