import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Review, ReviewService } from './review.service';
import { ReviewDialogComponent } from './review-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-review';
  reviews: Review[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.errorMessage = '';
    this.reviewService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  openDialog(review?: Review): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: review || null
    });

    dialogRef.afterClosed().subscribe((result: Review | undefined) => {
      if (result) {
        if (review) {
          this.updateReview(review, result);
        } else {
          this.addReview(result);
        }
      }
    });
  }

  addReview(newReview: Review): void {
    this.reviewService.addReview(newReview).subscribe({
      next: () => {
        this.loadReviews();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  updateReview(oldReview: Review, updatedReview: Review): void {
    this.reviewService.addReview(updatedReview).subscribe({
      next: () => {
        this.loadReviews();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  deleteReview(review: Review): void {
    if (confirm(`¿Eliminar la reseña de ${review.usuario} para ISBN ${review.isbn}?`)) {
      this.reviewService.deleteReview(review.usuario, review.isbn).subscribe({
        next: () => {
          this.loadReviews();
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }

  trackByReview(index: number, review: Review): string {
    return `${review.usuario}-${review.isbn}`;
  }
}