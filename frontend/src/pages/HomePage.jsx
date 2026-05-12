import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>
}

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card>
        <h2 style={{ marginBottom: 4, color: '#0a3d91' }}>
          Ola, {user?.nome ?? user?.email}!
        </h2>
        <div style={{ color: '#5a6783', fontSize: 14 }}>
          Voce esta logado como <strong>{user?.regra}</strong>.
        </div>
      </Card>

      {user?.regra === 'cliente' && (
        <Card>
          <div style={{ color: '#5a6783', fontSize: 13, fontWeight: 600, letterSpacing: 0.04 }}>
            CONTA CORRENTE
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#0a3d91', margin: '6px 0' }}>
            R$ {Number(user?.conta?.saldo ?? 0).toFixed(2)}
          </div>
          <div style={{ color: '#5a6783', fontSize: 14 }}>
            Agencia <strong>{user?.conta?.agencia}</strong>
            &nbsp;·&nbsp; Numero <strong>{user?.conta?.numero}</strong>
          </div>
        </Card>
      )}

      <Card>
        <h3 style={{ color: '#0a3d91', marginBottom: 12 }}>O que voce pode fazer</h3>
        <div className="grid-2">
          {user?.regra === 'gerente' && (
            <>
              <ActionLink to="/gerente/clientes" title="Listar Clientes" desc="Veja todos os clientes cadastrados e suas contas." />
              <ActionLink to="/gerente/cadastrar-cliente" title="Cadastrar Cliente" desc="Cria usuario, cliente e abre conta corrente." />
              <ActionLink to="/gerente/ajustar-saldo" title="Ajustar Saldo" desc="Operacao administrativa: credita ou debita um valor diretamente na conta do cliente." />
            </>
          )}
          {user?.regra === 'cliente' && (
            <>
              <ActionLink to="/cliente/deposito-saque" title="Deposito / Saque" desc="Coloque ou retire dinheiro da sua conta." />
              <ActionLink to="/cliente/pix" title="Transferencia Pix" desc="Envie valores para outro cliente pelo e-mail." />
              <ActionLink to="/cliente/aplicacao" title="Aplicacao Financeira" desc="Poupanca, titulos e acoes. Aplique e resgate." />
              <ActionLink to="/cliente/extrato" title="Extrato" desc="Veja suas movimentacoes com sinal de + e -." />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

function ActionLink({ to, title, desc }) {
  return (
    <Link
      to={to}
      style={{
        background: '#f5f7fc',
        border: '1px solid #d8dceb',
        padding: 16,
        borderRadius: 10,
        display: 'block',
      }}
    >
      <div style={{ color: '#0a3d91', fontWeight: 700, marginBottom: 4 }}>{title}</div>
      <div style={{ color: '#5a6783', fontSize: 14 }}>{desc}</div>
    </Link>
  )
}
