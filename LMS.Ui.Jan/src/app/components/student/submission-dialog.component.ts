import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SubmissionCreateDto } from '../../services/submission.service';
import { AssignmentResponseDto } from '../../services/assignment.service';

export interface SubmissionDialogData {
  assignment: AssignmentResponseDto;
}

@Component({
  selector: 'app-submission-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Submit Assignment</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Submission Title</mat-label>
          <input matInput formControlName="submissionTitle" />
          <mat-error *ngIf="form.get('submissionTitle')?.hasError('required')">Title is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Solution</mat-label>
          <textarea matInput formControlName="solution" rows="6"></textarea>
          <mat-error *ngIf="form.get('solution')?.hasError('required')">Solution is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Google Drive Link (optional)</mat-label>
          <input matInput formControlName="googleDriveLink" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="actions">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
        Submit
      </button>
    </div>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
      min-width: 500px;
    }
    mat-form-field {
      width: 100%;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
  `]
})
export class SubmissionDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubmissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubmissionDialogData
  ) {
    this.form = this.fb.group({
      submissionTitle: ['', Validators.required],
      solution: ['', Validators.required],
      googleDriveLink: ['']
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload: SubmissionCreateDto = {
        assignmentId: this.data.assignment.id,
        submissionTitle: formValue.submissionTitle,
        solution: formValue.solution,
        googleDriveLink: formValue.googleDriveLink || undefined
      };
      this.dialogRef.close(payload);
    }
  }
}
