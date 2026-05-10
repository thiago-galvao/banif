// ============================================================
// App.tsx — roteamento completo da aplicação
//
// Dependências: react-router (v7+), sonner
//
// Estrutura de rotas:
//   /login                  → público
//   /                       → protegido (qualquer logado) → Dashboard
//   /clientes               → só gerente
//   /novo-cliente           → só gerente
//   /extrato                → só cliente
//   /poupanca               → só cliente
//   /pix                    → só cliente
//   /contas                 → qualquer logado
//   /transacoes             → qualquer logado
//   /categorias             → qualquer logado
//   /relatorios             → qualquer logado
// ============================================================

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'sonner'

import { AuthProvider } from './AuthContext'
import { ProtectedRoute, RoleRoute } from './Guards'

import Login           from './pages/Login'
import Layout          from './pages/Layout'
import Dashboard       from './pages/Dashboard'
import Accounts        from './pages/Account'        // arquivo original
import Transactions    from './pages/Transactions'    // arquivo original
import Categories      from './pages/Categories'      // arquivo original
import Reports         from './pages/Reports'        // arquivo original

// Páginas gerente
import ClientesList, { CadastrarCliente } from './pages/Clientespages'

// Páginas cliente
import Extrato, { Poupanca, Pix } from './pages/Clientepages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Qualquer usuário logado */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />

              {/* Páginas do controle financeiro pessoal */}
              <Route path="contas"     element={<Accounts />} />
              <Route path="transacoes" element={<Transactions />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="relatorios" element={<Reports />} />

              {/* Rotas exclusivas do gerente */}
              <Route element={<RoleRoute role="gerente" />}>
                <Route path="clientes"     element={<ClientesList />} />
                <Route path="novo-cliente" element={<CadastrarCliente />} />
              </Route>

              {/* Rotas exclusivas do cliente */}
              <Route element={<RoleRoute role="cliente" />}>
                <Route path="extrato"  element={<Extrato />} />
                <Route path="poupanca" element={<Poupanca />} />
                <Route path="pix"      element={<Pix />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}