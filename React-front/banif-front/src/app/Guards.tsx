// ============================================================
// guards.tsx
// Componentes de proteção de rota.
//
// Uso no router:
//   <Route element={<ProtectedRoute />}>          → qualquer logado
//   <Route element={<RoleRoute role="gerente" />}> → só gerente
//   <Route element={<RoleRoute role="cliente" />}> → só cliente
// ============================================================

import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from './AuthContext'

// ---------- loader simples enquanto valida sessão ----------

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Verificando sessão…</p>
      </div>
    </div>
  )
}

// ---------- rota protegida genérica (qualquer usuário logado) ----------

export function ProtectedRoute() {
  const { user, token, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!token || !user) return <Navigate to="/login" replace />

  return <Outlet />
}

// ---------- rota restrita por papel ----------

interface RoleRouteProps {
  role: 'gerente' | 'cliente'
}

export function RoleRoute({ role }: RoleRouteProps) {
  const { user, token, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!token || !user) return <Navigate to="/login" replace />

  // Perfil ainda sendo carregado (regra null = aguardando /perfil)
  if (user.regra === null) return <LoadingScreen />

  if (user.regra !== role) {
    // Redireciona para o home certo conforme o papel real
    return <Navigate to="/" replace />
  }

  return <Outlet />
}