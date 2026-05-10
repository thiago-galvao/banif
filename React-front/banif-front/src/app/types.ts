// Tipos do sistema de controle de gastos

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'corrente' | 'poupanca';
  balance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'entrada' | 'saida';
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  type: 'entrada' | 'saida';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
