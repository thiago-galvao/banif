// ============================================================
// Layout.tsx — navegação condicional por regra (gerente / cliente)
// ============================================================

import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../AuthContext'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tag,
  FileText,
  LogOut,
  Menu,
  X,
  Users,
  UserPlus,
  PiggyBank,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'

type MenuItem = {
  path: string
  label: string
  icon: React.ElementType
  roles: Array<'gerente' | 'cliente' | null>
}

const menuItems: MenuItem[] = [
  // Comum a todos os logados
  { path: '/',              label: 'Dashboard',         icon: LayoutDashboard, roles: ['gerente', 'cliente', null] },

  // Apenas gerente
  { path: '/clientes',      label: 'Clientes',          icon: Users,           roles: ['gerente'] },
  { path: '/novo-cliente',  label: 'Cadastrar Cliente', icon: UserPlus,        roles: ['gerente'] },

  // Apenas cliente
  { path: '/extrato',       label: 'Extrato',           icon: FileText,        roles: ['cliente'] },
  { path: '/poupanca',      label: 'Poupança',          icon: PiggyBank,       roles: ['cliente'] },
  { path: '/pix',           label: 'Transferência Pix', icon: Send,            roles: ['cliente'] },

  // Controle financeiro pessoal (ambos os papéis)
  { path: '/contas',        label: 'Contas',            icon: Wallet,          roles: ['gerente', 'cliente', null] },
  { path: '/transacoes',    label: 'Transações',        icon: ArrowLeftRight,  roles: ['gerente', 'cliente', null] },
  { path: '/categorias',    label: 'Categorias',        icon: Tag,             roles: ['gerente', 'cliente', null] },
  { path: '/relatorios',    label: 'Relatórios',        icon: FileText,        roles: ['gerente', 'cliente', null] },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location         = useLocation()
  const navigate         = useNavigate()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso')
    navigate('/login')
  }

  const visibleItems = menuItems.filter((item) =>
    (item.roles as Array<string | null>).includes(user?.regra ?? null),
  )

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <>
      {visibleItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive(path)
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sair</span>
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600">Controle Financeiro</h1>
          <p className="text-sm text-gray-600 mt-1">
            Olá, {user?.nome}
            {user?.regra && (
              <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">
                {user.regra}
              </span>
            )}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
      </aside>

      {/* ── Header mobile ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-indigo-600">Controle Financeiro</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="p-4 space-y-1">
              <NavLinks onClose={() => setMobileOpen(false)} />
            </nav>
          </div>
        )}
      </div>

      {/* ── Conteúdo principal ── */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}