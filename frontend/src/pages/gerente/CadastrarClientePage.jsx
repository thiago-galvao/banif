import { useState } from 'react'
import { api } from '../../api/client.js'

const inicial = {
  fullName: '',
  email: '',
  password: '',
  cpf: '',
  cidade: '',
  estado: '',
  rua: '',
  numero: '',
}

export default function CadastrarClientePage() {
  const [form, setForm] = useState(inicial)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso(null)
    setEnviando(true)
    try {
      const res = await api('/gerente/cadastrar-cliente', { method: 'POST', body: form })
      setSucesso(res.data)
      setForm(inicial)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{ color: '#0a3d91', marginBottom: 4 }}>Cadastrar Cliente</h2>
      <div style={{ color: '#5a6783', fontSize: 14, marginBottom: 16 }}>
        Ao cadastrar, uma conta corrente eh aberta automaticamente e um e-mail (fake) eh enviado com login e senha.
      </div>

      {erro && <div className="alert error">{erro}</div>}
      {sucesso && (
        <div className="alert success">
          Cliente <strong>{sucesso.nome}</strong> criado.&nbsp;
          Agencia <strong>{sucesso.conta?.agencia}</strong> / Numero <strong>{sucesso.conta?.numero}</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="field">
            <label>Nome completo</label>
            <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div className="field">
            <label>Senha</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          </div>
          <div className="field">
            <label>CPF (so numeros)</label>
            <input value={form.cpf} onChange={(e) => set('cpf', e.target.value.replace(/\D/g, ''))} required maxLength={11} />
          </div>
          <div className="field">
            <label>Cidade</label>
            <input value={form.cidade} onChange={(e) => set('cidade', e.target.value)} required />
          </div>
          <div className="field">
            <label>Estado (UF)</label>
            <input value={form.estado} onChange={(e) => set('estado', e.target.value.toUpperCase())} required maxLength={2} />
          </div>
          <div className="field">
            <label>Rua</label>
            <input value={form.rua} onChange={(e) => set('rua', e.target.value)} required />
          </div>
          <div className="field">
            <label>Numero</label>
            <input value={form.numero} onChange={(e) => set('numero', e.target.value)} required />
          </div>
        </div>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando…' : 'Cadastrar cliente'}
        </button>
      </form>
    </div>
  )
}
