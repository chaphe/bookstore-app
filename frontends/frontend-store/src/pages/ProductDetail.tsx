import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft as ArrowLeft, FiStar as Star, FiShoppingCart as ShoppingCart, FiUser as User, FiMessageSquare as MessageSquare, FiArrowRight as ArrowRight } from 'react-icons/fi';
import { useBooks } from '../hooks/useBooks';
import { useReviews } from '../hooks/useReviews';
import { useCartAPI } from '../hooks/useCart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import type { Book, Review } from '../types';
import './ProductDetail.css';

export function ProductDetail() {
  const { isbn } = useParams<{ isbn: string }>();
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const { reviews, loading: reviewsLoading, createReview, removeReview } = useReviews();
  const { addToCart, currentUser } = useCartAPI();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ estrellas: 5, comentario: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverStars, setHoverStars] = useState(0);

  useEffect(() => {
    if (isbn) {
      const found = books.find((b) => b.isbn === isbn);
      if (found) {
        setBook(found);
        setLoading(false);
      } else if (!booksLoading) {
        setError('Libro no encontrado');
        setLoading(false);
      }
    }
  }, [isbn, books, booksLoading]);

  const bookReviews = reviews.filter((r) => r.isbn === isbn);

  const handleAddToCart = async () => {
    if (!book) return;
    try {
      await addToCart(book, quantity);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingReview(true);
    try {
      await createReview({
        usuario: currentUser,
        isbn: book!.isbn,
        estrellas: reviewForm.estrellas,
        comentario: reviewForm.comentario,
      });
      setShowReviewModal(false);
      setReviewForm({ estrellas: 5, comentario: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (review: Review) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    try {
      await removeReview(review.usuario, review.isbn);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canReview = currentUser && !bookReviews.some((r) => r.usuario === currentUser);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando libro...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="error-page">
        <h2>Libro no encontrado</h2>
        <p>{error || 'El libro solicitado no existe'}</p>
        <Link to="/" className="btn-back">
          <ArrowLeft size={18} />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Link to="/" className="btn-back-link" aria-label="Volver">
        <ArrowLeft size={20} />
        Volver al catálogo
      </Link>

      <div className="product-layout">
        <div className="product-gallery">
          <div className="book-cover">
            <svg width="300" height="450" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="300" height="450" fill="#f1f5f9" rx="8"/>
              <rect x="30" y="30" width="240" height="390" fill="#e2e8f0" rx="4"/>
              <text x="150" y="225" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="system-ui">{book.titulo.slice(0, 20)}</text>
              <text x="150" y="250" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="system-ui">ISBN: {book.isbn}</text>
            </svg>
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{book.titulo}</h1>
          <p className="product-author">por {book.autor}</p>
          <p className="product-isbn">ISBN: {book.isbn}</p>

          <div className="product-price">${parseFloat(book.valor).toFixed(2)}</div>

          <div className="product-stock">
            <span className={book.unidades > 0 ? 'in-stock' : 'out-of-stock'}>
              {book.unidades > 0 ? `En stock (${book.unidades} disponibles)` : 'Agotado'}
            </span>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>{book.descripcion || 'Sin descripción disponible'}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Cantidad:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Disminuir">−</button>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={book.unidades}
                  aria-label="Cantidad"
                />
                <button onClick={() => setQuantity(Math.min(book.unidades, quantity + 1))} aria-label="Aumentar">+</button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={book.unidades === 0 || adding}
            >
              <ShoppingCart size={20} />
              {adding ? 'Agregando...' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
      </div>

      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="reviews-header">
          <h2 id="reviews-heading">Reseñas ({bookReviews.length})</h2>
          {canReview && (
            <Button variant="secondary" onClick={() => setShowReviewModal(true)}>
              <MessageSquare size={18} />
              Escribir reseña
            </Button>
          )}
        </div>

        {bookReviews.length === 0 ? (
          <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en opinar!</p>
        ) : (
          <div className="reviews-list">
            {bookReviews.map((review) => (
              <article key={`${review.usuario}-${review.isbn}`} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <span className="user-avatar">{review.usuario.charAt(0).toUpperCase()}</span>
                    <span className="user-name">{review.usuario}</span>
                  </div>
                  <div className="review-stars" aria-label={`${review.estrellas} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={star <= review.estrellas ? 'filled' : 'empty'}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comentario}</p>
                {currentUser === review.usuario && (
                  <button
                    className="btn-delete-review"
                    onClick={() => handleDeleteReview(review)}
                    aria-label="Eliminar tu reseña"
                  >
                    <MessageSquare size={16} />
                    Eliminar
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Escribir reseña"
        size="md"
      >
        <form onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label htmlFor="estrellas">Calificación</label>
            <div className="star-rating" role="radiogroup" aria-label="Seleccionar calificación">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={star <= reviewForm.estrellas ? 'filled' : 'empty'}
                  onClick={() => setReviewForm((prev) => ({ ...prev, estrellas: star }))}
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(0)}
                  role="radio"
                  aria-checked={reviewForm.estrellas === star || hoverStars === star}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comentario">Comentario</label>
            <textarea
              id="comentario"
              value={reviewForm.comentario}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comentario: e.target.value }))}
              rows={4}
              placeholder="Comparte tu opinión sobre el libro..."
              required
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setShowReviewModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submittingReview}>
              {submittingReview ? 'Publicando...' : 'Publicar reseña'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}