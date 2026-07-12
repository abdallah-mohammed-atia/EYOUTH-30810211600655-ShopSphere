import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';

function NavBar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('zashop-theme') === 'dark');

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('zashop-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const goHome = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/', { replace: false });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <nav>
      <Link to="/" className="brand" onClick={goHome}>
        Zashop
      </Link>
      <div className="nav-links">
        <Link to="/" onClick={goHome}>Home</Link>
        {isAuthenticated && <Link to="/cart">Cart ({itemCount})</Link>}
        {isAuthenticated && <Link to="/profile">Profile</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}
        <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle dark mode">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        {isAuthenticated ? (
          <>
            <span>Hi, {user?.name}</span>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function AppShell() {
  return (
    <>
      <NavBar />
      <main>
        <AppRoutes />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
