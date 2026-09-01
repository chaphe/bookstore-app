export interface Book {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  valor: string;
  unidades: number;
}

export interface CartItem {
  usuario: string;
  isbn: string;
  cantidad: number;
}

export interface Cart {
  usuario: string;
  isbn: string;
  cantidad: number;
}

export interface Review {
  usuario: string;
  isbn: string;
  estrellas: number;
  comentario: string;
}

export interface AddCartRequest {
  usuario: string;
  isbn: string;
  cantidad: number;
}

export interface DeleteCartRequest {
  usuario: string;
  isbn: string;
}

export interface BuyCartRequest {
  usuario: string;
}

export interface GetCartRequest {
  usuario: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
}