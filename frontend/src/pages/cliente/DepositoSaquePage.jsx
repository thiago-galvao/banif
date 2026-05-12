import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

export default function DepositoSaquePage() {
  const [saldo, setSaldo] = useState(null)
  const [tipo, setTipo] = useState('depositar')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [msg, setMsg] = useState(null)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function recarregarSaldo() {
    try {
      const res = await api('/perfil')
      setSaldo(res.data?.conta?.saldo ?? null)
    } catch (err) { setErro(err.message) }
  }
  useEffect(() => { recarregarSaldo() }, [])

  async function submeter(e) {
    e.preventDefault()
    setErro('')
    setMsg(null)
    setEnviando(true)
    try {
      const res = await api(`/cliente/${tipo}`, {
        method: 'POST',
        body: {
          valor: Number(valor),
          descricao: descricao || undefined,
        },
      })
      setMsg(`${res.message} Novo saldo: R$ ${Number(res.data.saldo).toFixed(2)}`)
      setValor('')
      setDescricao('')
      recarregarSaldo()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#0a3d91', marginBottom: 4 }}>Deposito / Saque</h2>
      <div style={{ color: '#5a6783', fontSize: 14, marginBottom: 12 }}>
        Saldo atual:&nbsp;
        <strong style={{ color: '#0a3d91' }}>
          R$ {saldo !== null ? Number(saldo).toFixed(2) : '—'}
        </strong>
      </div>

      {erro && <div className="alert error">{erro}</div>}
      {msg && <div className="alert success">{msg}</div>}

      <form onSubmit={submeter}>
        <div className="row">
          <div className="field">
            <label>Operacao</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="depositar">Deposito (+)</option>
              <option value="sacar">Saque (-)</option>
            </select>
          </div>
          <div className="field">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" min="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label>Descricao (opcional)</label>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: salario, compra, etc." />
        </div>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : (tipo === 'depositar' ? 'Depositar' : 'Sacar')}
        </button>
      </form>
    </div>
  )
}
