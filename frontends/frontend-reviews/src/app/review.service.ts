import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Review {
  usuario: string;
  isbn: string;
  estrellas: number;
  comentario: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly baseUrl = environment.reviewsUrl;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews`).pipe(
      catchError(this.handleError)
    );
  }

  addReview(review: Review): Observable<Review> {
    const params = {
      usuario: review.usuario,
      isbn: review.isbn,
      estrellas: review.estrellas.toString(),
      comentario: review.comentario
    };
    return this.http.post<Review>(`${this.baseUrl}/addreviews`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  deleteReview(usuario: string, isbn: string): Observable<void> {
    const params = { usuario, isbn };
    return this.http.delete<void>(`${this.baseUrl}/deletereviews`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let message = 'Error de conexion con el servidor';
    if (error.error instanceof ErrorEvent) {
      message = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      message = 'No se puede conectar al backend. Verifique que este activo.';
    } else if (error.status === 400) {
      message = error.error?.error || 'Datos invalidos';
    } else if (error.status === 404) {
      message = error.error?.error || 'Reseña no encontrada';
    } else if (error.status >= 500) {
      message = 'Error interno del servidor';
    }
    return throwError(() => new Error(message));
  }
}