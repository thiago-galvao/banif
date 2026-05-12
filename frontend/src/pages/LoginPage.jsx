import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('gerente@banif.com')
  const [password, setPassword] = useState('123456')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setErro(err.message || 'Falha ao realizar login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #0b4eb8 0%, #0b1530 60%)',
        padding: 20,
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#0a3d91',
              color: '#e8b40c',
              fontWeight: 700,
              fontSize: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            B
          </div>
          <h1 style={{ fontSize: 22, color: '#0a3d91' }}>BANIF</h1>
          <div style={{ fontSize: 13, color: '#5a6783', marginTop: 4 }}>
            Acesse sua conta para continuar
          </div>
        </div>

        {erro && <div className="alert error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={carregando} style={{ width: '100%' }}>
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: 18, fontSize: 12, color: '#5a6783', textAlign: 'center' }}>
          Dados padrao (seeder): <br />
          gerente@banif.com / 123456 — gerente <br />
          thiago@hotmail.com / 123456 — cliente
        </div>
      </div>
    </div>
  )
}
