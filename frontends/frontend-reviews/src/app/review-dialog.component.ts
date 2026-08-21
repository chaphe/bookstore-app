import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Review } from './review.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Review | null
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      isbn: ['', Validators.required],
      estrellas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}