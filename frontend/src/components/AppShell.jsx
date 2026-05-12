import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const linksGerente = [
    { to: '/', label: 'Home' },
    { to: '/gerente/clientes', label: 'Clientes' },
    { to: '/gerente/cadastrar-cliente', label: 'Cadastrar Cliente' },
    { to: '/gerente/ajustar-saldo', label: 'Ajustar Saldo' },
  ]
  const linksCliente = [
    { to: '/', label: 'Home' },
    { to: '/cliente/deposito-saque', label: 'Deposito/Saque' },
    { to: '/cliente/pix', label: 'Pix' },
    { to: '/cliente/aplicacao', label: 'Aplicacao' },
    { to: '/cliente/extrato', label: 'Extrato' },
  ]
  const links = user?.regra === 'gerente' ? linksGerente : linksCliente

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: 'linear-gradient(120deg, #0a3d91, #0b4eb8)',
          color: '#fff',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#e8b40c',
              color: '#0a3d91',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            B
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>BANIF</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>
              {user?.regra === 'gerente' ? 'Modulo Gerente' : 'Modulo Cliente'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ opacity: 0.85, fontSize: 14 }}>{user?.email}</span>
          <button className="ghost" onClick={handleLogout} style={{ color: '#fff', borderColor: '#fff' }}>
            Sair
          </button>
        </div>
      </header>

      <nav
        style={{
          background: '#111d3d',
          padding: '0 28px',
          display: 'flex',
          gap: 18,
          overflowX: 'auto',
        }}
      >
        {links.map((l) => {
          const active = location.pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              style={{
                color: active ? '#e8b40c' : '#fff',
                padding: '12px 4px',
                borderBottom: active ? '2px solid #e8b40c' : '2px solid transparent',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>

      <main
        style={{
          flex: 1,
          padding: 28,
          background: '#eef1f8',
          color: '#1a2238',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  )
}
