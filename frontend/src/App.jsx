import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ListarClientesPage from './pages/gerente/ListarClientesPage.jsx'
import CadastrarClientePage from './pages/gerente/CadastrarClientePage.jsx'
import AjustarSaldoPage from './pages/gerente/AjustarSaldoPage.jsx'
import PixPage from './pages/cliente/PixPage.jsx'
import ExtratoPage from './pages/cliente/ExtratoPage.jsx'
import AplicacaoPage from './pages/cliente/AplicacaoPage.jsx'
import DepositoSaquePage from './pages/cliente/DepositoSaquePage.jsx'
import AppShell from './components/AppShell.jsx'

function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Carregando…</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.regra)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell>
              <HomePage />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="/gerente/clientes"
        element={
          <RequireAuth roles={['gerente']}>
            <AppShell>
              <ListarClientesPage />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/gerente/cadastrar-cliente"
        element={
          <RequireAuth roles={['gerente']}>
            <AppShell>
              <CadastrarClientePage />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/gerente/ajustar-saldo"
        element={
          <RequireAuth roles={['gerente']}>
            <AppShell>
              <AjustarSaldoPage />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="/cliente/deposito-saque"
        element={
          <RequireAuth roles={['cliente']}>
            <AppShell>
              <DepositoSaquePage />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/cliente/pix"
        element={
          <RequireAuth roles={['cliente']}>
            <AppShell>
              <PixPage />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/cliente/extrato"
        element={
          <RequireAuth roles={['cliente']}>
            <AppShell>
              <ExtratoPage />
            </AppShell>
          </RequireAuth>
        }
      />
      <Route
        path="/cliente/aplicacao"
        element={
          <RequireAuth roles={['cliente']}>
            <AppShell>
              <AplicacaoPage />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
