import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

export default function ListarClientesPage() {
  const [clientes, setClientes] = useState([])
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/gerente/clientes')
      .then((res) => setClientes(res.data || []))
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card">
      <h2 style={{ color: '#0a3d91', marginBottom: 14 }}>Clientes cadastrados</h2>
      {erro && <div className="alert error">{erro}</div>}
      {loading ? (
        'Carregando…'
      ) : clientes.length === 0 ? (
        <div style={{ color: '#5a6783' }}>Nenhum cliente cadastrado.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f5f7fc', textAlign: 'left' }}>
                <th style={th}>#</th>
                <th style={th}>Nome</th>
                <th style={th}>E-mail</th>
                <th style={th}>CPF</th>
                <th style={th}>Agencia</th>
                <th style={th}>Numero</th>
                <th style={th}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eef1f8' }}>
                  <td style={td}>{c.id}</td>
                  <td style={td}>{c.nome}</td>
                  <td style={td}>{c.email}</td>
                  <td style={td}>{c.cpf}</td>
                  <td style={td}>{c.conta?.agencia}</td>
                  <td style={td}>{c.conta?.numero}</td>
                  <td style={td}>R$ {Number(c.conta?.saldo ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const th = { padding: 10, fontWeight: 700, color: '#0a3d91', borderBottom: '1px solid #d8dceb' }
const td = { padding: 10 }
