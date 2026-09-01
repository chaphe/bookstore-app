import { useState, useEffect, useCallback } from 'react';
import { getReviews } from '../services/api';
import type { Review } from '../types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const getAverageByIsbn = useCallback((isbn: string): number | null => {
    const bookReviews = reviews.filter((r) => r.isbn === isbn);
    if (bookReviews.length === 0) return null;
    const sum = bookReviews.reduce((acc, r) => acc + r.estrellas, 0);
    return Math.round((sum / bookReviews.length) * 10) / 10;
  }, [reviews]);

  return { reviews, loading, error, refetch: fetchReviews, getAverageByIsbn };
}
