import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

const rotuloTipo = {
  deposito: 'Deposito',
  saque: 'Saque',
  ajuste_credito: 'Ajuste (credito)',
  ajuste_debito: 'Ajuste (debito)',
  pix_enviado: 'Pix enviado',
  pix_recebido: 'Pix recebido',
  aplicacao_investida: 'Aplicacao investida',
  aplicacao_resgatada: 'Aplicacao resgatada',
}

export default function ExtratoPage() {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api('/cliente/extrato-transacoes')
      .then((res) => setTransacoes(res.data?.transacoes || []))
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card">
      <h2 style={{ color: '#0a3d91', marginBottom: 12 }}>Extrato</h2>
      {erro && <div className="alert error">{erro}</div>}
      {loading ? (
        'Carregando…'
      ) : transacoes.length === 0 ? (
        <div style={{ color: '#5a6783' }}>Sem movimentacoes ate o momento.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transacoes.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: '#f5f7fc',
                borderRadius: 10,
                borderLeft: `4px solid ${t.sentido === 'entrada' ? '#1e9d61' : '#c0392b'}`,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#0a3d91' }}>
                  {rotuloTipo[t.tipo] ?? t.tipo}
                </div>
                <div style={{ fontSize: 12, color: '#5a6783' }}>
                  {t.descricao || '—'} · {t.data ? new Date(t.data).toLocaleString('pt-BR') : ''}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: t.sentido === 'entrada' ? '#1e9d61' : '#c0392b',
                  fontSize: 18,
                }}
              >
                {t.valor}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
