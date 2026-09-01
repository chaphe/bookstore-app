import axios, { AxiosInstance, AxiosError } from 'axios';
import type { Book, Cart, CartItem, Review, AddCartRequest, DeleteCartRequest, BuyCartRequest, GetCartRequest, ApiError } from '../types';

const runtimeEnv = (typeof window !== 'undefined' && (window as any).env) || {};
const CATALOG_URL = runtimeEnv.CATALOG_URL || import.meta.env.VITE_CATALOG_URL || 'http://localhost:8081/api';
const REVIEWS_URL = runtimeEnv.REVIEWS_URL || import.meta.env.VITE_REVIEWS_URL || 'http://localhost:3000';
const STORE_URL = runtimeEnv.STORE_URL || import.meta.env.VITE_STORE_URL || 'http://localhost:8082/api';

const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        return Promise.reject({
          status: error.response.status,
          error: error.response.data?.error || 'Error',
          message: error.response.data?.message || error.message,
        });
      }
      return Promise.reject({
        status: 0,
        error: 'Network Error',
        message: 'No se puede conectar al servidor',
      });
    }
  );

  return client;
};

export const catalogApi = createApiClient(CATALOG_URL);
export const reviewsApi = createApiClient(REVIEWS_URL);
export const storeApi = createApiClient(STORE_URL);

export const getBooks = async (): Promise<Book[]> => {
  const response = await catalogApi.get<Book[]>('/getlibros');
  return response.data;
};

export const getReviews = async (): Promise<Review[]> => {
  const response = await reviewsApi.get<Review[]>('/reviews');
  return response.data;
};

export const getCart = async (usuario: string): Promise<Cart[]> => {
  const response = await storeApi.get<Cart[]>('/getcart', { params: { usuario } });
  return response.data;
};

export const addToCart = async (data: { usuario: string; isbn: string; cantidad: number }): Promise<{ status: string }> => {
  const response = await storeApi.post<{ status: string }>('/addcart', data);
  return response.data;
};

export const removeFromCart = async (data: { usuario: string; isbn: string }): Promise<{ status: string }> => {
  const response = await storeApi.delete<{ status: string }>('/deletecart', { data });
  return response.data;
};

export const buyCart = async (usuario: string): Promise<{ status: string }> => {
  const response = await storeApi.post<{ status: string }>('/buycart', { usuario });
  return response.data;
};

export const addReview = async (review: { usuario: string; isbn: string; estrellas: number; comentario: string }): Promise<{ code: string }> => {
  const response = await reviewsApi.post<{ code: string }>('/addreviews', null, {
    params: { usuario: review.usuario, isbn: review.isbn, estrellas: review.estrellas, comentario: review.comentario },
  });
  return response.data;
};

export const deleteReview = async (usuario: string, isbn: string): Promise<{ code: string }> => {
  const response = await reviewsApi.delete<{ code: string }>('/deletereviews', {
    params: { usuario, isbn },
  });
  return response.data;
};