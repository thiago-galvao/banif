// Gerenciamento de dados locais com localStorage

import { User, Account, Transaction, Category } from './types';

const STORAGE_KEYS = {
  USERS: 'expense_control_users',
  ACCOUNTS: 'expense_control_accounts',
  CATEGORIES: 'expense_control_categories',
  TRANSACTIONS: 'expense_control_transactions',
  CURRENT_USER: 'expense_control_current_user',
};

// Usuários
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Contas
export const getAccounts = (userId: string): Account[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const accounts: Account[] = data ? JSON.parse(data) : [];
  return accounts.filter((account) => account.userId === userId);
};

export const saveAccount = (account: Account): void => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const accounts: Account[] = data ? JSON.parse(data) : [];
  accounts.push(account);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const updateAccount = (accountId: string, updates: Partial<Account>): void => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const accounts: Account[] = data ? JSON.parse(data) : [];
  const index = accounts.findIndex((acc) => acc.id === accountId);
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }
};

export const deleteAccount = (accountId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const accounts: Account[] = data ? JSON.parse(data) : [];
  const filtered = accounts.filter((acc) => acc.id !== accountId);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(filtered));
};

export const getAccountById = (accountId: string): Account | undefined => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const accounts: Account[] = data ? JSON.parse(data) : [];
  return accounts.find((acc) => acc.id === accountId);
};

// Categorias
export const getCategories = (userId: string): Category[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  return categories.filter((category) => category.userId === userId);
};

export const saveCategory = (category: Category): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  categories.push(category);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const updateCategory = (categoryId: string, updates: Partial<Category>): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  const index = categories.findIndex((cat) => cat.id === categoryId);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
};

export const deleteCategory = (categoryId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  const filtered = categories.filter((cat) => cat.id !== categoryId);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories: Category[] = data ? JSON.parse(data) : [];
  return categories.find((cat) => cat.id === categoryId);
};

// Transações
export const getTransactions = (userId: string): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  return transactions.filter((transaction) => transaction.userId === userId);
};

export const saveTransaction = (transaction: Transaction): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  
  // Atualizar saldo da conta
  const account = getAccountById(transaction.accountId);
  if (account) {
    const newBalance = transaction.type === 'entrada' 
      ? account.balance + transaction.amount 
      : account.balance - transaction.amount;
    updateAccount(transaction.accountId, { balance: newBalance });
  }
};

export const updateTransaction = (transactionId: string, updates: Partial<Transaction>): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  const index = transactions.findIndex((trans) => trans.id === transactionId);
  
  if (index !== -1) {
    const oldTransaction = transactions[index];
    const newTransaction = { ...oldTransaction, ...updates };
    
    // Reverter saldo antigo
    const account = getAccountById(oldTransaction.accountId);
    if (account) {
      const revertedBalance = oldTransaction.type === 'entrada'
        ? account.balance - oldTransaction.amount
        : account.balance + oldTransaction.amount;
      
      // Aplicar novo saldo
      const newBalance = newTransaction.type === 'entrada'
        ? revertedBalance + newTransaction.amount
        : revertedBalance - newTransaction.amount;
      
      updateAccount(oldTransaction.accountId, { balance: newBalance });
    }
    
    transactions[index] = newTransaction;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

export const deleteTransaction = (transactionId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  const transactions: Transaction[] = data ? JSON.parse(data) : [];
  const transaction = transactions.find((trans) => trans.id === transactionId);
  
  if (transaction) {
    // Reverter saldo da conta
    const account = getAccountById(transaction.accountId);
    if (account) {
      const newBalance = transaction.type === 'entrada'
        ? account.balance - transaction.amount
        : account.balance + transaction.amount;
      updateAccount(transaction.accountId, { balance: newBalance });
    }
    
    const filtered = transactions.filter((trans) => trans.id !== transactionId);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
  }
};
