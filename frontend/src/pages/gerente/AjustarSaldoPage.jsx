import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

export default function AjustarSaldoPage() {
  const [clientes, setClientes] = useState([])
  const [contaId, setContaId] = useState('')
  const [tipo, setTipo] = useState('credito')
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [msg, setMsg] = useState(null)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function carregarClientes() {
    try {
      const res = await api('/gerente/clientes')
      setClientes(res.data || [])
    } catch (err) { setErro(err.message) }
  }
  useEffect(() => { carregarClientes() }, [])

  async function submeter(e) {
    e.preventDefault()
    setErro('')
    setMsg(null)
    setEnviando(true)
    try {
      const res = await api('/gerente/ajustar-saldo', {
        method: 'POST',
        body: {
          contaId: Number(contaId),
          tipo,
          valor: Number(valor),
          descricao: descricao || undefined,
        },
      })
      setMsg(`${res.message} Novo saldo: R$ ${Number(res.data.saldo).toFixed(2)}`)
      setValor('')
      setDescricao('')
      carregarClientes()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#0a3d91', marginBottom: 4 }}>Ajustar saldo de cliente</h2>
      <div style={{ color: '#5a6783', fontSize: 14, marginBottom: 16 }}>
        Operacao administrativa: o gerente credita ou debita um valor diretamente na conta do cliente.
        Aparece no extrato dele como "ajuste".
      </div>

      {erro && <div className="alert error">{erro}</div>}
      {msg && <div className="alert success">{msg}</div>}

      <form onSubmit={submeter}>
        <div className="field">
          <label>Cliente / Conta</label>
          <select value={contaId} onChange={(e) => setContaId(e.target.value)} required>
            <option value="">Selecione…</option>
            {clientes
              .filter((c) => c.conta)
              .map((c) => (
                <option key={c.conta.id} value={c.conta.id}>
                  {c.nome} — Ag {c.conta.agencia} / N {c.conta.numero} — saldo R$ {Number(c.conta.saldo).toFixed(2)}
                </option>
              ))}
          </select>
        </div>
        <div className="row">
          <div className="field">
            <label>Tipo de ajuste</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="credito">Credito (adicionar saldo)</option>
              <option value="debito">Debito (retirar saldo)</option>
            </select>
          </div>
          <div className="field">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" min="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label>Descricao (opcional)</label>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: estorno de tarifa indevida" />
        </div>
        <button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Registrar ajuste'}</button>
      </form>
    </div>
  )
}
