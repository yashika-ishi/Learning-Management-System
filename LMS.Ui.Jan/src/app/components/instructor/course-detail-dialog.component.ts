import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseResponseDto } from '../../services/instructor-course.service';

@Component({
  selector: 'app-course-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Course Details</h2>
    <mat-dialog-content>
      <div class="detail-section">
        <div class="detail-item">
          <label>Course Name:</label>
          <p>{{ data.courseName }}</p>
        </div>
        <div class="detail-item">
          <label>Course Code:</label>
          <p>{{ data.courseCode }}</p>
        </div>
        <div class="detail-item">
          <label>Description:</label>
          <p>{{ data.description }}</p>
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <p>
            <span 
              class="status-badge"
              [class.draft]="data.status === 'Draft'"
              [class.pending]="data.status === 'Pending'"
              [class.published]="data.status === 'Published'">
              {{ data.status }}
            </span>
          </p>
        </div>
        <div class="detail-item">
          <label>Created At:</label>
          <p>{{ formatDate(data.createdAt) }}</p>
        </div>
        <div class="detail-item" *ngIf="data.youTubeUrl">
          <label>YouTube Link:</label>
          <p>
            <a [href]="data.youTubeUrl" target="_blank" class="link">
              <mat-icon>play_circle</mat-icon>
              Watch Video
            </a>
          </p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-section {
      min-width: 400px;
      padding: 20px 0;
    }

    .detail-item {
      margin-bottom: 20px;
    }

    .detail-item label {
      display: block;
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .detail-item p {
      margin: 0;
      color: #2d2f31;
      font-size: 16px;
      line-height: 1.5;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.draft {
      background: #fff3cd;
      color: #b7791f;
    }

    .status-badge.pending {
      background: #cfe2ff;
      color: #084298;
    }

    .status-badge.published {
      background: #d1e7dd;
      color: #0f5132;
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s;
    }

    .link:hover {
      color: #764ba2;
    }

    .link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class CourseDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CourseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseResponseDto
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
