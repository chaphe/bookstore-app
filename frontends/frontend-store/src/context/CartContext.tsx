import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import type { Cart, Book } from '../types';

interface CartState {
  items: Cart[];
  loading: boolean;
  error: string | null;
  currentUser: string | null;
}

type CartAction =
  | { type: 'SET_USER'; payload: string }
  | { type: 'SET_CART'; payload: Cart[] }
  | { type: 'ADD_ITEM'; payload: { book: Book; cantidad: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { isbn: string; cantidad: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_USER' };

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  currentUser: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, items: [], error: null };
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.isbn === action.payload.book.isbn);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.isbn === action.payload.book.isbn
              ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { usuario: action.payload.book.isbn, isbn: action.payload.book.isbn, cantidad: action.payload.cantidad }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.isbn !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.cantidad <= 0) {
        return { ...state, items: state.items.filter((item) => item.isbn !== action.payload.isbn) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.isbn === action.payload.isbn ? { ...item, cantidad: action.payload.cantidad } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_USER':
      return { ...initialState };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (book: Book, cantidad: number) => void;
  removeItem: (isbn: string) => void;
  updateQuantity: (isbn: string, cantidad: number) => void;
  clearCart: () => void;
  clearUser: () => void;
  setUser: (user: string) => void;
  setCart: (items: Cart[]) => void;
  getTotalItems: () => number;
  getTotalPrice: (books: Record<string, { book: Book; cantidad: number }>) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('store_user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: savedUser });
    }
  }, []);

  const addItem = useCallback((book: any, cantidad: number) => dispatch({ type: 'ADD_ITEM', payload: { book, cantidad } }), []);
  const removeItem = useCallback((isbn: string) => dispatch({ type: 'REMOVE_ITEM', payload: isbn }), []);
  const updateQuantity = useCallback((isbn: string, cantidad: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { isbn, cantidad } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const clearUser = useCallback(() => {
    localStorage.removeItem('store_user');
    dispatch({ type: 'CLEAR_USER' });
  }, []);
  const setUser = useCallback((user: string) => {
    localStorage.setItem('store_user', user);
    dispatch({ type: 'SET_USER', payload: user });
  }, []);
  const setCart = useCallback((items: Cart[]) => {
    dispatch({ type: 'SET_CART', payload: items });
  }, []);

  const getTotalItems = useCallback(() => state.items.reduce((sum, item) => sum + item.cantidad, 0), [state.items]);

  const getTotalPrice = useCallback((books: Record<string, { book: Book; cantidad: number }>) => {
    return Object.entries(books).reduce((total, [isbn, { book, cantidad }]) => {
      return total + parseFloat(book.valor) * cantidad;
    }, 0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearUser,
        setUser,
        setCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}