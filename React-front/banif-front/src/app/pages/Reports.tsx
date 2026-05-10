import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getTransactions, getAccounts, getCategories } from '../storage';
import { Transaction, Account, Category } from '../types';
import { FileText, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import * as LucideIcons from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    if (user) {
      setTransactions(getTransactions(user.id));
      setAccounts(getAccounts(user.id));
      setCategories(getCategories(user.id));
    }
  }, [user]);

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Tag;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  };

  // Filtrar transações por período
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactionDate >= start && transactionDate <= end;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Dados por categoria
  const expensesByCategory = categories
    .filter((cat) => cat.type === 'saida')
    .map((cat) => {
      const total = filteredTransactions
        .filter((t) => t.categoryId === cat.id && t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, total };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  const incomeByCategory = categories
    .filter((cat) => cat.type === 'entrada')
    .map((cat) => {
      const total = filteredTransactions
        .filter((t) => t.categoryId === cat.id && t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, total };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  // Dados mensais (últimos 6 meses)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter((t) => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter((t) => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(date, 'MMM', { locale: ptBR }),
      Entradas: income,
      Saídas: expenses,
      Saldo: income - expenses,
    };
  });

  // Exportar relatório
  const exportReport = () => {
    let csv = 'Data,Tipo,Categoria,Conta,Descrição,Valor\n';
    filteredTransactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.categoryId);
        const account = accounts.find((a) => a.id === t.accountId);
        csv += `${format(new Date(t.date), 'dd/MM/yyyy')},${t.type === 'entrada' ? 'Entrada' : 'Saída'},${category?.name || ''},${account?.name || ''},${t.description},${t.amount.toFixed(2)}\n`;
      });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise detalhada das suas finanças</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Filtro de Período */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Período</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Resumo do Período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total de Entradas</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {filteredTransactions.filter((t) => t.type === 'entrada').length} transação(ões)
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total de Saídas</p>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {filteredTransactions.filter((t) => t.type === 'saida').length} transação(ões)
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Saldo do Período</p>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">{filteredTransactions.length} transação(ões)</p>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Evolução Mensal (Últimos 6 Meses)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="Entradas" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Saídas" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="Saldo" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Despesas por Categoria */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Despesas por Categoria</h2>
        {expensesByCategory.length > 0 ? (
          <div className="space-y-4">
            {expensesByCategory.map((category) => {
              const percentage = (category.total / totalExpenses) * 100;
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {renderIcon(category.icon, category.color)}
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {category.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Nenhuma despesa no período</div>
        )}
      </div>

      {/* Entradas por Categoria */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Entradas por Categoria</h2>
        {incomeByCategory.length > 0 ? (
          <div className="space-y-4">
            {incomeByCategory.map((category) => {
              const percentage = (category.total / totalIncome) * 100;
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {renderIcon(category.icon, category.color)}
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {category.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Nenhuma entrada no período</div>
        )}
      </div>

      {/* Detalhamento de Transações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Detalhamento de Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => {
                    const category = categories.find((c) => c.id === transaction.categoryId);
                    const account = accounts.find((a) => a.id === transaction.accountId);
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(transaction.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === 'entrada'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {account?.name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                            transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma transação no período selecionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
