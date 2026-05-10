import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import {
  getTransactions,
  saveTransaction,
  updateTransaction,
  deleteTransaction,
  getAccounts,
  getCategories,
} from '../storage';
import { Transaction, Account, Category } from '../types';
import { Plus, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, X, Check, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import * as LucideIcons from 'lucide-react';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');
  const [formData, setFormData] = useState({
    accountId: '',
    categoryId: '',
    type: 'saida' as Transaction['type'],
    amount: 0,
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const loadData = () => {
    if (user) {
      setTransactions(getTransactions(user.id));
      setAccounts(getAccounts(user.id));
      setCategories(getCategories(user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      });
    } else {
      setEditingTransaction(null);
      const defaultAccount = accounts[0]?.id || '';
      const defaultCategory = categories.filter((c) => c.type === 'saida')[0]?.id || '';
      setFormData({
        accountId: defaultAccount,
        categoryId: defaultCategory,
        type: 'saida',
        amount: 0,
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleTypeChange = (type: Transaction['type']) => {
    const defaultCategory = categories.filter((c) => c.type === type)[0]?.id || '';
    setFormData({ ...formData, type, categoryId: defaultCategory });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountId || !formData.categoryId) {
      toast.error('Selecione uma conta e uma categoria');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Preencha a descrição');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, formData);
      toast.success('Transação atualizada com sucesso');
    } else {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        userId: user!.id,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveTransaction(newTransaction);
      toast.success('Transação registrada com sucesso');
    }

    loadData();
    closeModal();
  };

  const handleDelete = (transactionId: string) => {
    if (window.confirm('Deseja realmente excluir esta transação?')) {
      deleteTransaction(transactionId);
      toast.success('Transação excluída com sucesso');
      loadData();
    }
  };

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Tag;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  };

  // Filtrar transações
  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const category = categories.find((c) => c.id === t.categoryId);
        const account = accounts.find((a) => a.id === t.accountId);
        return (
          t.description.toLowerCase().includes(search) ||
          category?.name.toLowerCase().includes(search) ||
          account?.name.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600 mt-1">Registre suas entradas e saídas</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Transações</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {filteredTransactions.length}
              </p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Entradas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                R$ {totalIncome.toFixed(2)}
              </p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Saídas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                R$ {totalExpenses.toFixed(2)}
              </p>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar transações..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('entrada')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'entrada'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilterType('saida')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === 'saida'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Saídas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const category = categories.find((c) => c.id === transaction.categoryId);
              const account = accounts.find((a) => a.id === transaction.accountId);
              return (
                <div
                  key={transaction.id}
                  className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: category?.color + '20' }}
                    >
                      {category && renderIcon(category.icon, category.color)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {category?.name} • {account?.name} • {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(transaction)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-500">
              <ArrowUpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma transação encontrada</h3>
              <p className="text-gray-600 mb-6">Comece registrando sua primeira transação</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Criar Primeira Transação
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('entrada')}
                    className={`p-3 rounded-lg border-2 transition ${
                      formData.type === 'entrada'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ArrowUpCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <span className="text-sm font-medium">Entrada</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('saida')}
                    className={`p-3 rounded-lg border-2 transition ${
                      formData.type === 'saida'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ArrowDownCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <span className="text-sm font-medium">Saída</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conta *</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">Selecione uma conta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories
                    .filter((cat) => cat.type === formData.type)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Almoço no restaurante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
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
                  {editingTransaction ? 'Salvar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
