import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InstructorCourseService, CourseResponseDto, CourseCreateDto } from '../../services/instructor-course.service';
import { CourseDialogComponent } from './course-dialog.component';

@Component({
  selector: 'app-instructor-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    CourseDialogComponent
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">My Courses</h1>
        <p class="welcome-subtitle">Create and manage your courses</p>
      </div>

      <div class="search-action-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="applyFilter()"
            placeholder="Search by course name or code">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="openCreate()" class="create-button">Create</button>
      </div>

      <div class="cards">
        <mat-card *ngFor="let course of filteredCourses" class="course-card">
          <mat-card-header>
            <mat-card-title>{{ course.courseName }}</mat-card-title>
            <mat-card-subtitle>{{ course.courseCode }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ course.description }}</p>
            <div
              class="status"
              [class.draft]="course.status === 'Draft'"
              [class.pending]="course.status === 'Pending'"
              [class.published]="course.status === 'Published'">
              {{ course.status }}
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button
              *ngIf="course.youTubeUrl"
              mat-stroked-button
              color="primary"
              (click)="openYoutube(course.youTubeUrl!)">
              Open
            </button>
            <button mat-stroked-button color="accent" (click)="openEdit(course)">Edit</button>
            <button
              mat-raised-button
              color="primary"
              [disabled]="course.status !== 'Draft'"
              (click)="requestPublish(course)">
              {{ course.status === 'Draft' ? 'Publish' : course.status }}
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
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(17, 153, 142, 0.3);
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
    .search-action-container {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .search-field {
      max-width: 500px;
      flex: 1;
    }
    .create-button {
      white-space: nowrap;
      margin-left: auto;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }
    .course-card {
      position: relative;
    }
    .description {
      min-height: 48px;
      color: #4a4a4a;
    }
    .status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 8px;
    }
    .status.draft {
      background: #fff3cd;
      color: #b7791f;
    }
    .status.pending {
      background: #ebf4ff;
      color: #1d4ed8;
    }
    .status.published {
      background: #e6fffa;
      color: #0f766e;
    }
    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px 16px;
    }
  `]
})
export class InstructorMyCoursesComponent implements OnInit {
  courses: CourseResponseDto[] = [];
  filteredCourses: CourseResponseDto[] = [];
  searchText: string = '';

  constructor(
    private courseService: InstructorCourseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getMyCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
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

  openCreate(): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '480px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((payload?: CourseCreateDto) => {
      if (payload) {
        this.courseService.createCourse(payload).subscribe(created => {
          this.courses = [created, ...this.courses];
          this.applyFilter();
        });
      }
    });
  }

  openEdit(course: CourseResponseDto): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '480px',
      data: { mode: 'edit', course }
    });

    dialogRef.afterClosed().subscribe((payload?: CourseCreateDto) => {
      if (payload) {
        this.courseService.updateCourse(course.id, payload).subscribe(updated => {
          this.courses = this.courses.map(c => (c.id === updated.id ? updated : c));
          this.applyFilter();
        });
      }
    });
  }

  requestPublish(course: CourseResponseDto): void {
    alert('Waiting for the approval');
    this.courseService.requestPublish(course.id).subscribe(() => {
      this.courses = this.courses.map(c =>
        c.id === course.id ? { ...c, status: 'Pending', isDraft: false } : c
      );
      this.applyFilter();
    });
  }

  openYoutube(url: string): void {
    window.open(url, '_blank');
  }
}
