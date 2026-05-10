// ============================================================
// Extrato.tsx — GET /api/v1/cliente/extrato-transacoes
// ============================================================

import React, { useEffect, useState } from 'react'
import { getExtrato, Transacao, getPixInfo, enviarPix, PixSaldoData, getPoupanca, aplicarPoupanca, PoupancaData } from '../api/api'
import { toast } from 'sonner'
import { ArrowUpCircle, PiggyBank, ArrowDownCircle, FileText, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Send, Wallet } from 'lucide-react'

export default function Extrato() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading]        = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await getExtrato()
    setLoading(false)

    if (res.status === 'success') {
      setTransacoes(res.data.transacoes)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => { load() }, [])

  const total = transacoes.reduce(
    (acc, t) => acc + (t.tipo === 'credito' ? t.valor : -t.valor),
    0,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Extrato</h1>
          <p className="text-gray-600 mt-1">Histórico de transações da sua conta</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-xl">
        <p className="text-indigo-200 mb-1">Saldo atual (extrato)</p>
        <p className={`text-4xl font-bold ${total >= 0 ? 'text-white' : 'text-red-300'}`}>
          R$ {total.toFixed(2)}
        </p>
        <p className="text-indigo-200 mt-2">{transacoes.length} transação(ões)</p>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Movimentações</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transacoes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transacoes.map((t, idx) => (
              <div key={idx} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${t.tipo === 'credito' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.tipo === 'credito'
                      ? <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      : <ArrowDownCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t.conta.usuario.nome}</p>
                    <p className="text-sm text-gray-500 capitalize">{t.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${t.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo === 'credito' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(t.data), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// ============================================================
// Poupanca.tsx
//   GET  /api/v1/cliente/aplicar-poupanca  — exibe saldo
//   POST /api/v1/cliente/aplicar-poupanca  — aplica valor
// ============================================================


export function Poupanca() {
  const [conta, setConta]     = useState<PoupancaData['conta'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [valor, setValor]     = useState('')
  const [applying, setApplying] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await getPoupanca()
    setLoading(false)
    if (res.status === 'success') {
      setConta(res.data.conta)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => { load() }, [])

  const handleAplicar = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = parseFloat(valor)
    if (!v || v <= 0) {
      toast.error('Informe um valor válido')
      return
    }
    setApplying(true)
    const res = await aplicarPoupanca({ valor: v })
    setApplying(false)

    if (res.status === 'success') {
      toast.success('Valor aplicado com sucesso!')
      setConta(res.data.conta)
      setValor('')
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Poupança</h1>
        <p className="text-gray-600 mt-1">Saldo e aplicações da sua conta poupança</p>
      </div>

      {/* Saldo */}
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <PiggyBank className="w-7 h-7" />
          <p className="text-yellow-100">Conta Poupança</p>
        </div>
        {loading ? (
          <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : conta ? (
          <>
            <p className="text-4xl font-bold">R$ {conta.saldo.toFixed(2)}</p>
            <p className="text-yellow-100 mt-2 text-sm">
              Ag. {conta.agencia} — Conta {conta.numero}
            </p>
          </>
        ) : null}
      </div>

      {/* Formulário de aplicação */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aplicar na Poupança</h2>
        <form onSubmit={handleAplicar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              placeholder="0.00"
              disabled={applying}
            />
          </div>
          <button
            type="submit"
            disabled={applying}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {applying ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ArrowUpCircle className="w-5 h-5" />
                Aplicar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}


// ============================================================
// Pix.tsx
//   GET  /api/v1/cliente/transf-pix  — exibe saldo + e-mail
//   POST /api/v1/cliente/transf-pix  — envia transferência
// ============================================================


export function Pix() {
  const [info, setInfo]       = useState<PixSaldoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    email:    '',
    valor:    '',
    descricao: '',
  })

  const load = async () => {
    setLoading(true)
    const res = await getPixInfo()
    setLoading(false)
    if (res.status === 'success') {
      setInfo(res.data)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => { load() }, [])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = parseFloat(formData.valor)

    if (!formData.email) { toast.error('Informe o e-mail (chave Pix)'); return }
    if (!v || v <= 0)    { toast.error('Informe um valor válido');        return }
    if (info && v > info.conta.saldo) {
      toast.error('Saldo insuficiente')
      return
    }

    setSending(true)
    const res = await enviarPix({
      email:    formData.email,
      valor:    v,
      tipo:     'pix',
      descricao: formData.descricao || undefined,
    })
    setSending(false)

    if (res.status === 'success') {
      toast.success(`Pix de R$ ${res.data.valor.toFixed(2)} enviado com sucesso!`)
      setFormData({ email: '', valor: '', descricao: '' })
      load() // atualiza saldo
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transferência Pix</h1>
        <p className="text-gray-600 mt-1">Envie dinheiro instantaneamente por e-mail</p>
      </div>

      {/* Saldo */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 rounded-xl flex items-center gap-4">
        <Wallet className="w-8 h-8 text-green-200" />
        <div>
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <p className="text-green-100 text-sm">{info?.email}</p>
              <p className="text-3xl font-bold">R$ {info?.conta.saldo.toFixed(2)}</p>
              <p className="text-green-100 text-sm">Saldo disponível</p>
            </>
          )}
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Enviar Pix</h2>
        <form onSubmit={handleEnviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chave Pix (e-mail do destinatário) *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="destinatario@email.com"
              disabled={sending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="0.00"
              disabled={sending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="Ex: Pagamento de aluguel"
              disabled={sending}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {sending ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Pix
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}