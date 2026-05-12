import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

const rotulo = {
  poupanca: 'Poupanca',
  titulos: 'Titulos do Governo',
  acoes: 'Acoes',
}

export default function AplicacaoPage() {
  const [conta, setConta] = useState(null)
  const [aplicacoes, setAplicacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [tipoSel, setTipoSel] = useState('poupanca')
  const [valor, setValor] = useState('')

  async function recarregar() {
    try {
      const res = await api('/cliente/aplicacoes')
      setConta(res.data?.conta)
      setAplicacoes(res.data?.aplicacoes || [])
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { recarregar() }, [])

  async function executar(rota) {
    setErro('')
    setMsg(null)
    setEnviando(true)
    try {
      const res = await api(rota, {
        method: 'POST',
        body: { tipo: tipoSel, valor: Number(valor) },
      })
      setMsg(`${res.message} Saldo atual: R$ ${Number(res.data.saldoAtual).toFixed(2)}`)
      setValor('')
      recarregar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card">
        <h2 style={{ color: '#0a3d91', marginBottom: 4 }}>Aplicacao Financeira</h2>
        <div style={{ color: '#5a6783', fontSize: 14 }}>
          Saldo da conta corrente:&nbsp;
          <strong style={{ color: '#0a3d91' }}>
            R$ {conta ? Number(conta.saldo).toFixed(2) : '—'}
          </strong>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: '#0a3d91', marginBottom: 10 }}>Seus saldos aplicados</h3>
        {loading ? (
          'Carregando…'
        ) : (
          <div className="grid-2">
            {aplicacoes.map((a) => (
              <div
                key={a.tipo}
                style={{
                  background: '#f5f7fc',
                  border: '1px solid #d8dceb',
                  padding: 14,
                  borderRadius: 10,
                }}
              >
                <div style={{ color: '#5a6783', fontSize: 13, fontWeight: 600 }}>{rotulo[a.tipo]}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0a3d91' }}>
                  R$ {Number(a.valorAplicado).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ color: '#0a3d91', marginBottom: 10 }}>Aplicar / Resgatar</h3>
        {erro && <div className="alert error">{erro}</div>}
        {msg && <div className="alert success">{msg}</div>}

        <div className="row">
          <div className="field">
            <label>Tipo</label>
            <select value={tipoSel} onChange={(e) => setTipoSel(e.target.value)}>
              <option value="poupanca">Poupanca</option>
              <option value="titulos">Titulos do Governo</option>
              <option value="acoes">Acoes</option>
            </select>
          </div>
          <div className="field">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" min="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => executar('/cliente/aplicar')} disabled={enviando || !valor}>
            Aplicar
          </button>
          <button className="ghost" onClick={() => executar('/cliente/resgatar')} disabled={enviando || !valor}>
            Resgatar
          </button>
        </div>
      </div>
    </div>
  )
}
