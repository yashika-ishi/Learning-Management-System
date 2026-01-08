import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InstructorCourseService, CourseResponseDto } from '../../services/instructor-course.service';
import { EnrollmentService, EnrollmentResponseDto } from '../../services/enrollment.service';

@Component({
  selector: 'app-student-courses',
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
        <h1 class="welcome-title">Courses</h1>
        <p class="welcome-subtitle">Explore and enroll in available courses</p>
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
        <mat-card *ngFor="let course of filteredCourses" class="course-card">
          <mat-card-header>
            <mat-card-title>{{ course.courseName }}</mat-card-title>
            <mat-card-subtitle>{{ course.courseCode }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ course.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              [disabled]="enrollmentStatus(course.id) !== 'Enroll'"
              (click)="enroll(course.id)">
              {{ enrollmentStatus(course.id) }}
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
export class StudentCoursesComponent implements OnInit {
  courses: CourseResponseDto[] = [];
  filteredCourses: CourseResponseDto[] = [];
  enrollments: EnrollmentResponseDto[] = [];
  searchText: string = '';

  constructor(
    private courseService: InstructorCourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadEnrollments();
  }

  loadCourses(): void {
    this.courseService.getPublishedCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
  }

  loadEnrollments(): void {
    this.enrollmentService.getMyEnrollments().subscribe(enrs => (this.enrollments = enrs));
  }

  applyFilter(): void {
    const searchStr = this.searchText.trim().toLowerCase();
    if (!searchStr) {
      this.filteredCourses = this.courses;
      return;
    }
    this.filteredCourses = this.courses.filter(course =>
      course.courseName?.toLowerCase().includes(searchStr) ||
      course.courseCode?.toLowerCase().includes(searchStr)
    );
  }

  enrollmentStatus(courseId: number): 'Enroll' | 'Pending' | 'Approved' | 'Disapproved' {
    const enr = this.enrollments.find(e => e.courseId === courseId);
    if (!enr) return 'Enroll';
    if (enr.status === 'Pending') return 'Pending';
    if (enr.status === 'Approved') return 'Approved';
    return 'Disapproved';
  }

  enroll(courseId: number): void {
    alert('Waiting for approval');
    this.enrollmentService.requestEnrollment(courseId).subscribe(enr => {
      const existingIndex = this.enrollments.findIndex(e => e.courseId === courseId);
      if (existingIndex >= 0) {
        this.enrollments[existingIndex] = enr;
      } else {
        this.enrollments.push(enr);
      }
    });
  }
}
