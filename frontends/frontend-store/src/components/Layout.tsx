import React, { useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiShoppingCart as ShoppingCart, FiHome as Home, FiLogOut as LogOut, FiUser as User, FiMenu as Menu, FiX as X } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Layout.css';

export function Layout() {
  const { currentUser, getTotalItems, clearUser } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { path: '/', label: 'Inicio', icon: Home },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearUser();
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo" aria-label="Ir al inicio">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>BookStore</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Navegación principal">
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/cart"
                  className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart size={18} />
                  <span>Carrito{currentUser ? ` (${getTotalItems()})` : ''}</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            {currentUser ? (
              <div className="user-menu">
                <span className="user-name">{currentUser}</span>
                <button
                  onClick={handleLogout}
                  className="btn-ghost"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                <User size={18} />
                <span>Ingresar</span>
              </Link>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="main-content" role="main">
        <div className="container"><Outlet /></div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 BookStore. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}