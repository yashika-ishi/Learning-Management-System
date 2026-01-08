import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EnrollmentService, EnrollmentResponseDto } from '../../services/enrollment.service';

@Component({
  selector: 'app-student-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">My Courses</h1>
        <p class="welcome-subtitle">Access your enrolled courses</p>
      </div>

      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="applyFilter()"
            placeholder="Search by course name or code">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="cards">
        <mat-card *ngFor="let enr of filteredEnrollments" class="course-card">
          <mat-card-header>
            <mat-card-title>{{ enr.courseName }}</mat-card-title>
            <mat-card-subtitle>{{ enr.courseCode }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ enr.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button
              *ngIf="enr.youTubeUrl"
              mat-stroked-button
              color="primary"
              (click)="openYoutube(enr.youTubeUrl!)">
              Open
            </button>
            <button mat-raised-button color="accent" (click)="viewAssignments(enr.courseId)">
              View Assignment
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.06);
    }
    .welcome-section {
      background: linear-gradient(135deg, #ff8c37 0%, #ff512f 100%);
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(255, 140, 55, 0.3);
      animation: slideDown 0.6s ease-out;
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .welcome-title {
      margin: 0;
      color: #fff;
      font-size: 48px;
      font-weight: 700;
      animation: fadeIn 0.8s ease-out;
    }
    .welcome-subtitle {
      margin: 16px 0 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      animation: fadeIn 1s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .search-container {
      margin-bottom: 20px;
    }
    .search-field {
      max-width: 500px;
      width: 100%;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }
    .description { min-height: 48px; color: #4a4a4a; }
    mat-card-actions { padding: 12px 16px 16px; }
  `]
})
export class StudentMyCoursesComponent implements OnInit {
  enrollments: EnrollmentResponseDto[] = [];
  filteredEnrollments: EnrollmentResponseDto[] = [];
  searchText: string = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get approvedEnrollments(): EnrollmentResponseDto[] {
    return this.enrollments.filter(e => e.status === 'Approved');
  }

  load(): void {
    this.enrollmentService.getMyEnrollments().subscribe(enrs => {
      this.enrollments = enrs;
      this.filteredEnrollments = this.approvedEnrollments;
    });
  }

  applyFilter(): void {
    const searchStr = this.searchText.trim().toLowerCase();
    const approved = this.approvedEnrollments;
    if (!searchStr) {
      this.filteredEnrollments = approved;
      return;
    }
    this.filteredEnrollments = approved.filter(enr =>
      enr.courseName?.toLowerCase().includes(searchStr) ||
      enr.courseCode?.toLowerCase().includes(searchStr)
    );
  }

  openYoutube(url: string): void {
    window.open(url, '_blank');
  }

  viewAssignments(courseId: number): void {
    this.router.navigate(['/student/assignments']);
  }
}
