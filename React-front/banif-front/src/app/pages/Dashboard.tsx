// ============================================================
// Dashboard.tsx — usa dados do AuthContext (já vêm de /perfil)
// ============================================================

import React from 'react'
import { useAuth } from '../AuthContext'
import { Wallet, ArrowUpCircle, User, Users } from 'lucide-react'
import { Link } from 'react-router'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  // ---------- Gerente ----------
  if (user.regra === 'gerente') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, {user.nome} 👋</h1>
          <p className="text-gray-600 mt-1">Painel do Gerente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/clientes"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-indigo-100 p-4 rounded-full">
              <Users className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Listar Clientes</p>
              <p className="text-sm text-gray-600">Visualize todas as contas</p>
            </div>
          </Link>

          <Link
            to="/novo-cliente"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <User className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Cadastrar Cliente</p>
              <p className="text-sm text-gray-600">Adicione um novo cliente</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // ---------- Cliente ----------
  if (user.regra === 'cliente') {
    // conta vem do perfil — mas aqui usamos apenas o que está no AuthUser.
    // Os dados completos de conta ficam em cada página específica.
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, {user.nome} 👋</h1>
          <p className="text-gray-600 mt-1">Painel do Cliente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/extrato"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <ArrowUpCircle className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Extrato</p>
              <p className="text-sm text-gray-600">Veja suas transações</p>
            </div>
          </Link>

          <Link
            to="/poupanca"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-yellow-100 p-4 rounded-full">
              <Wallet className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Poupança</p>
              <p className="text-sm text-gray-600">Gerencie aplicações</p>
            </div>
          </Link>

          <Link
            to="/pix"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <ArrowUpCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Pix</p>
              <p className="text-sm text-gray-600">Transferências instantâneas</p>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // Carregando perfil
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}