import { createBrowserRouter, Navigate } from 'react-router';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Account';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { getCurrentUser } from './storage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
    
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'contas',
        element: <Accounts />,
      },
      {
        path: 'transacoes',
        element: <Transactions />,
      },
      {
        path: 'categorias',
        element: <Categories />,
      },
      {
        path: 'relatorios',
        element: <Reports />,
      },
    ],
  },
]);
