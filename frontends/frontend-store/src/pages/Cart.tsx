import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft as ArrowLeft, FiTrash2 as Trash2, FiMinus as Minus, FiPlus as Plus, FiCreditCard as CreditCard } from 'react-icons/fi';
import { useCartAPI } from '../hooks/useCart';
import { useBooks } from '../hooks/useBooks';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Book, Cart } from '../types';
import './Cart.css';

export function CartPage() {
  const { items, currentUser, loading, error, fetchCart, removeFromCart, buyCart } = useCartAPI();
  const { books } = useBooks();
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchCart(currentUser);
    }
  }, [currentUser, fetchCart]);

  const bookMap: Record<string, Book> = {};
  books.forEach((book) => {
    bookMap[book.isbn] = book;
  });

  const getBook = (isbn: string) => bookMap[isbn];

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = items.reduce((sum, item) => {
    const book = getBook(item.isbn);
    return sum + (book ? parseFloat(book.valor) * item.cantidad : 0);
  }, 0);

  const handleRemove = async (isbn: string) => {
    try {
      await removeFromCart(isbn);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBuy = async () => {
    if (!currentUser || items.length === 0) return;
    setBuying(true);
    try {
      await buyCart();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBuying(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="cart-empty">
        <div className="empty-cart">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1 0 8h-8" />
          </svg>
          <h2>Inicia sesión para ver tu carrito</h2>
          <p>Tu carrito se guardará automáticamente al iniciar sesión</p>
          <Link to="/login" className="btn-continue">
            <CreditCard size={18} />
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Button variant="primary" onClick={() => currentUser && fetchCart(currentUser)}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1 0 8h-8" />
          </svg>
          <h2>Tu carrito está vacío</h2>
          <p>Explora el catálogo y agrega algunos libros</p>
          <Link to="/" className="btn-continue">
            <ArrowLeft size={18} />
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Link to="/" className="btn-back-link" aria-label="Volver">
        <ArrowLeft size={20} />
        Seguir comprando
      </Link>

      <h1 className="page-title">Tu Carrito ({totalItems})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const book = getBook(item.isbn);
            return book ? (
              <article key={item.isbn} className="cart-item">
                <div className="item-image">
                  <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="80" height="120" fill="#f1f5f9" rx="4"/>
                    <rect x="8" y="8" width="64" height="104" fill="#e2e8f0" rx="2"/>
                    <text x="40" y="65" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="system-ui">{book.titulo.slice(0, 12)}</text>
                  </svg>
                </div>
                <div className="item-details">
                  <h3 className="item-title">{book.titulo}</h3>
                  <p className="item-author">{book.autor}</p>
                  <p className="item-price">${parseFloat(book.valor).toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      onClick={() => {
                        const newQty = item.cantidad - 1;
                        if (newQty > 0) {
                        }
                      }}
                      aria-label="Disminuir"
                      disabled
                    >−</button>
                    <span className="quantity-value">{item.cantidad}</span>
                    <button
                      onClick={() => {
                        const newQty = item.cantidad + 1;
                      }}
                      aria-label="Aumentar"
                      disabled
                    >+</button>
                  </div>
                </div>
                <div className="item-subtotal">
                  ${(parseFloat(book.valor) * item.cantidad).toFixed(2)}
                </div>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(item.isbn)}
                  aria-label={`Eliminar ${book.titulo}`}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ) : null;
          })}
        </div>

        <aside className="cart-summary">
          <Card>
            <h2 className="summary-title">Resumen del pedido</h2>
            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="btn-checkout"
              onClick={handleBuy}
              disabled={items.length === 0 || buying}
            >
              <CreditCard size={20} />
              {buying ? 'Procesando...' : 'Proceder al pago'}
            </Button>
            <p className="secure-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Pago seguro SSL
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;