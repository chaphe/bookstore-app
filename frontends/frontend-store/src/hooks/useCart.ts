import { useState, useCallback } from 'react';
import { getCart, addToCart, removeFromCart, buyCart } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Book } from '../types';

export function useCartAPI() {
  const { items, currentUser, addItem, removeItem, updateQuantity, clearCart, setUser, clearUser, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async (usuario: string) => {
    if (!usuario) return;
    setLoading(true);
    try {
      const data = await getCart(usuario);
      setCart(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar carrito');
    } finally {
      setLoading(false);
    }
  }, [setCart]);

  const addToCartAPI = async (book: any, cantidad: number) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await addToCart({ usuario: currentUser, isbn: book.isbn, cantidad });
      addItem({ isbn: book.isbn, titulo: book.titulo, valor: book.valor, autor: book.autor }, cantidad);
    } catch (err: any) {
      throw new Error(err.message || 'Error al agregar al carrito');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCartAPI = async (isbn: string) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await removeFromCart({ usuario: currentUser!, isbn });
      removeItem(isbn);
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar del carrito');
    } finally {
      setLoading(false);
    }
  };

  const buyCartAPI = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await buyCart(currentUser);
      clearCart();
    } catch (err: any) {
      throw new Error(err.message || 'Error al procesar compra');
    } finally {
      setLoading(false);
    }
  };

  const login = (user: string) => {
    setUser(user);
  };

  const logout = () => {
    clearUser();
  };

  return {
    items,
    currentUser,
    loading,
    error,
    fetchCart,
    addToCart: addToCartAPI,
    removeFromCart: removeFromCartAPI,
    buyCart: buyCartAPI,
    login,
    logout,
  };
}