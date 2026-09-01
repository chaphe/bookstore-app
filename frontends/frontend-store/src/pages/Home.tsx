import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch as Search, FiFilter as Filter, FiShoppingCart as ShoppingCart, FiStar as Star } from 'react-icons/fi';
import { useBooks } from '../hooks/useBooks';
import { useReviews } from '../hooks/useReviews';
import { useCartAPI } from '../hooks/useCart';
import { Book } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import '../components/Home.css';

export function Home() {
  const { books, loading, error, refetch } = useBooks();
  const { getAverageByIsbn } = useReviews();
  const { addToCart, currentUser } = useCartAPI();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState<string | null>(null);

  const filteredBooks = books.filter(
    (book) =>
      book.titulo.toLowerCase().includes(search.toLowerCase()) ||
      book.autor.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.includes(search)
  );

  const handleAddToCart = async (book: Book) => {
    setAdding(book.isbn);
    try {
      await addToCart(book, 1);
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando libros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a BookStore</h1>
          <p>Descubre tu próxima lectura entre miles de títulos disponibles</p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <Input
              type="search"
              placeholder="Buscar por título, autor o ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search"
              aria-label="Buscar libros"
            />
          </div>
          <span className="results-count">{filteredBooks.length} libros encontrados</span>
        </div>
      </section>

      <section className="books-section" aria-label="Catálogo de libros">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron libros con ese criterio</p>
            <Button variant="secondary" onClick={() => setSearch('')}>
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="books-grid" role="list" aria-label="Libros disponibles">
            {filteredBooks.map((book) => (
              <article key={book.isbn} className="book-card" role="listitem">
                <div className="book-image">
                  <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="120" height="180" fill="#f1f5f9" rx="4"/>
                    <rect x="10" y="10" width="100" height="160" fill="#e2e8f0" rx="2"/>
                    <text x="60" y="95" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="system-ui">ISBN: {book.isbn.slice(-4)}</text>
                  </svg>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.titulo}</h3>
                  <p className="book-author">{book.autor}</p>
                  <p className="book-price">${parseFloat(book.valor).toFixed(2)}</p>
                  <p className="book-rating">
                    {(() => {
                      const avg = getAverageByIsbn(book.isbn);
                      return avg !== null ? (
                        <>
                          <Star size={14} className="star-icon filled" />
                          <span>{avg.toFixed(1)}</span>
                        </>
                      ) : (
                        <span className="no-reviews">Sin reseñas</span>
                      );
                    })()}
                  </p>
                  <p className="book-stock">
                    {book.unidades > 0 ? `En stock (${book.unidades})` : 'Agotado'}
                  </p>
                </div>
                <div className="book-actions">
                  <Link to={`/product/${book.isbn}`} className="btn-view" aria-label={`Ver detalles de ${book.titulo}`}>
                    Ver detalles
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(book)}
                    disabled={book.unidades === 0 || adding === book.isbn}
                    aria-label={adding === book.isbn ? 'Agregando...' : `Agregar ${book.titulo} al carrito`}
                  >
                    {adding === book.isbn ? 'Agregando...' : 'Agregar'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}