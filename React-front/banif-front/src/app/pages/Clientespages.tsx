// ============================================================
// ClientesList.tsx — GET /api/v1/gerente/clientes
// ============================================================

import React, { useEffect, useState } from 'react'
import { getClientes, Cliente, cadastrarCliente } from '../api/api'
import { toast } from 'sonner'
import { Users, Wallet, RefreshCw } from 'lucide-react'
import { UserPlus, Check } from 'lucide-react'

export default function ClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await getClientes()
    setLoading(false)

    if (res.status === 'success') {
      setClientes(res.data)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Lista de todos os clientes cadastrados</p>
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

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clientes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{cliente.nome}</h3>
                  <p className="text-sm text-gray-500">{cliente.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span>Ag. {cliente.conta.agencia} — CC {cliente.conta.numero}</span>
                </div>
                <p className={`text-xl font-bold ${cliente.conta.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {cliente.conta.saldo.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ============================================================
// CadastrarCliente.tsx — POST /api/v1/gerente/cadastrar-cliente
// ============================================================



export function CadastrarCliente() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' })
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error('Preencha todos os campos')
      return
    }

    setLoading(true)
    const res = await cadastrarCliente(formData)
    setLoading(false)

    if (res.status === 'success') {
      toast.success(res.message ?? 'Cliente cadastrado com sucesso')
      setFormData({ nome: '', email: '', senha: '' })
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Cliente</h1>
        <p className="text-gray-600 mt-1">Adicione um novo cliente ao sistema</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Nome completo"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="cliente@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Cadastrar Cliente
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}