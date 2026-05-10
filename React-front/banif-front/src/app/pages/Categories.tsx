import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { getCategories, saveCategory, updateCategory, deleteCategory } from '../storage';
import { Category } from '../types';
import { Plus, Edit2, Trash2, Tag, X, Check, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'saida' as Category['type'],
    color: '#3b82f6',
    icon: 'Tag',
  });

  const loadCategories = () => {
    if (user) {
      setCategories(getCategories(user.id));
    }
  };

  useEffect(() => {
    loadCategories();
  }, [user]);

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
  ];

  const iconOptions = [
    'Tag', 'Briefcase', 'Code', 'TrendingUp', 'Plus', 'UtensilsCrossed',
    'Car', 'Home', 'Heart', 'GraduationCap', 'PartyPopper', 'ShoppingBag',
    'Smartphone', 'Wifi', 'Zap', 'Coffee', 'Gift', 'Plane',
  ];

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', type: 'saida', color: '#3b82f6', icon: 'Tag' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', type: 'saida', color: '#3b82f6', icon: 'Tag' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Preencha o nome da categoria');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      toast.success('Categoria atualizada com sucesso');
    } else {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        userId: user!.id,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveCategory(newCategory);
      toast.success('Categoria criada com sucesso');
    }

    loadCategories();
    closeModal();
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (window.confirm(`Deseja realmente excluir a categoria "${categoryName}"?`)) {
      deleteCategory(categoryId);
      toast.success('Categoria excluída com sucesso');
      loadCategories();
    }
  };

  const entranceCategories = categories.filter((c) => c.type === 'entrada');
  const expenseCategories = categories.filter((c) => c.type === 'saida');

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Tag;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">Organize suas entradas e despesas</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {/* Categorias de Entrada */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Entradas</h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {entranceCategories.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entranceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {renderIcon(category.icon, category.color)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias de Saída */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowDownCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Saídas</h2>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            {expenseCategories.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {renderIcon(category.icon, category.color)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {categories.length === 0 && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma categoria cadastrada</h3>
          <p className="text-gray-600 mb-6">Categorias padrão foram criadas automaticamente</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Alimentação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'entrada' })}
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
                    onClick={() => setFormData({ ...formData, type: 'saida' })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div className="grid grid-cols-9 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ícone
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {iconOptions.map((icon) => {
                    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Tag;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 rounded-lg transition ${
                          formData.icon === icon
                            ? 'bg-indigo-100 border-2 border-indigo-500'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto" />
                      </button>
                    );
                  })}
                </div>
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
                  {editingCategory ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
