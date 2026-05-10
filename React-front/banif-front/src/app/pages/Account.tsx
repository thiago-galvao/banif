import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getAccounts, saveAccount, updateAccount, deleteAccount } from '../storage';
import { Account } from '../types';
import { Plus, Edit2, Trash2, Wallet, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Accounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'corrente' as Account['type'],
    balance: 0,
  });

  const loadAccounts = () => {
    if (user) {
      setAccounts(getAccounts(user.id));
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [user]);

  const accountTypes = [
    { value: 'corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Poupança' },
    { value: 'investimento', label: 'Investimento' },
    { value: 'carteira', label: 'Carteira' },
  ];

  const openModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance,
      });
    } else {
      setEditingAccount(null);
      setFormData({ name: '', type: 'corrente', balance: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({ name: '', type: 'corrente', balance: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Preencha o nome da conta');
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
      toast.success('Conta atualizada com sucesso');
    } else {
      const newAccount: Account = {
        id: crypto.randomUUID(),
        userId: user!.id,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveAccount(newAccount);
      toast.success('Conta criada com sucesso');
    }

    loadAccounts();
    closeModal();
  };

  const handleDelete = (accountId: string, accountName: string) => {
    if (window.confirm(`Deseja realmente excluir a conta "${accountName}"?`)) {
      deleteAccount(accountId);
      toast.success('Conta excluída com sucesso');
      loadAccounts();
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas contas financeiras</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nova Conta
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg">
        <p className="text-indigo-200 mb-2">Saldo Total</p>
        <p className="text-4xl font-bold">R$ {totalBalance.toFixed(2)}</p>
        <p className="text-indigo-200 mt-2">{accounts.length} conta(s) cadastrada(s)</p>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">
                    {accountTypes.find((t) => t.value === account.type)?.label}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(account)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(account.id, account.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold mt-1 ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {account.balance.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma conta cadastrada</h3>
          <p className="text-gray-600 mb-6">Comece criando sua primeira conta financeira</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Criar Primeira Conta
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Conta *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Conta Corrente Banco X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="0.00"
                  disabled={!!editingAccount}
                />
                {editingAccount && (
                  <p className="text-sm text-gray-500 mt-1">
                    O saldo é atualizado automaticamente pelas transações
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingAccount ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}