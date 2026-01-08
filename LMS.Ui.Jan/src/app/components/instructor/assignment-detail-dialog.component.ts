import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentResponseDto } from '../../services/assignment.service';

export interface AssignmentDetailDialogData {
  assignment: AssignmentResponseDto;
}

@Component({
  selector: 'app-assignment-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.assignment.title }}</h2>
    <div mat-dialog-content class="content">
      <div class="detail-item">
        <strong>Description:</strong>
        <p>{{ data.assignment.description }}</p>
      </div>
      <div class="detail-item">
        <strong>Course:</strong>
        <p>{{ data.assignment.courseName }}</p>
      </div>
      <div class="detail-item">
        <strong>Start Date:</strong>
        <p>{{ formatDate(data.assignment.startDate) }}</p>
      </div>
      <div class="detail-item">
        <strong>Last Date:</strong>
        <p>{{ formatDate(data.assignment.lastDate) }}</p>
      </div>
      <div class="detail-item">
        <strong>Date of Creation:</strong>
        <p>{{ formatDate(data.assignment.createdAt) }}</p>
      </div>
      <div class="detail-item" *ngIf="data.assignment.googleDriveLink">
        <strong>Google Drive Link:</strong>
        <a [href]="data.assignment.googleDriveLink" target="_blank" class="drive-link">
          <mat-icon>link</mat-icon>
          Open Google Drive
        </a>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .content {
      min-width: 500px;
      max-width: 600px;
    }
    .detail-item {
      margin-bottom: 16px;
    }
    .detail-item strong {
      display: block;
      margin-bottom: 4px;
      color: #2d2f31;
    }
    .detail-item p {
      margin: 0;
      color: #4a4a4a;
    }
    .drive-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      text-decoration: none;
      margin-top: 4px;
    }
    .drive-link:hover {
      text-decoration: underline;
    }
  `]
})
export class AssignmentDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AssignmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignmentDetailDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
