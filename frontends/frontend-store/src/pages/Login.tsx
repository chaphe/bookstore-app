import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser as User } from 'react-icons/fi';
import { useCartAPI } from '../hooks/useCart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import './Login.css';

export function LoginPage() {
  const { login } = useCartAPI();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="login-icon">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h1>Bienvenido a BookStore</h1>
            <p>Ingresa tu nombre de usuario para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="btn-login"
            >
              Entrar
            </Button>
          </form>

          <Link to="/" className="back-link">
            Volver al catálogo
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
