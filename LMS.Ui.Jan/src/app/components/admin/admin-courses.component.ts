import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InstructorCourseService, CourseResponseDto, CourseCreateDto } from '../../services/instructor-course.service';
import { CourseDialogComponent } from '../instructor/course-dialog.component';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CourseDialogComponent
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">Courses</h1>
        <p class="welcome-subtitle">Manage all courses in the system</p>
      </div>

      <div class="search-filter-container">
        <mat-form-field class="search-field" appearance="outline">
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="filterCourses()" 
            placeholder="Search by course name or course code">
          <mat-icon matSuffix class="search-icon">search</mat-icon>
        </mat-form-field>

        <mat-form-field class="filter-field" appearance="outline">
          <mat-select 
            [(ngModel)]="statusFilter" 
            (selectionChange)="filterCourses()" 
            placeholder="Filter by status">
            <mat-option value="">All Status</mat-option>
            <mat-option value="Draft">Draft</mat-option>
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="Published">Published</mat-option>
          </mat-select>
          <mat-icon matPrefix class="filter-icon">filter_list</mat-icon>
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
              [disabled]="course.status !== 'Pending'"
              (click)="approve(course)">
              {{ course.status === 'Published' ? 'Published' : 'Approve Publish' }}
            </button>
            <button mat-stroked-button color="warn" (click)="delete(course)">Delete</button>
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
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    }
    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
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
      margin: 8px 0 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      animation: fadeIn 1s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .search-filter-container {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      align-items: center;
      justify-content: space-between;
    }
    .search-field {
      max-width: 500px;
    }
    .filter-field {
      min-width: 200px;
    }
    .search-icon {
      color: #667eea;
      cursor: pointer;
    }
    .filter-icon {
      color: #667eea;
      margin-right: 8px;
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
    .course-card { position: relative; }
    .description { min-height: 48px; color: #4a4a4a; }
    .status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      margin-top: 8px;
    }
    .status.draft { background: #fff3cd; color: #b7791f; }
    .status.pending { background: #ebf4ff; color: #1d4ed8; }
    .status.published { background: #e6fffa; color: #0f766e; }
    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px 16px;
      flex-wrap: wrap;
    }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses: CourseResponseDto[] = [];
  filteredCourses: CourseResponseDto[] = [];
  searchText: string = '';
  statusFilter: string = '';

  constructor(
    private courseService: InstructorCourseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
  }

  filterCourses(): void {
    let filtered = this.courses;

    // Apply search filter
    if (this.searchText && this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(course => 
        course.courseName.toLowerCase().includes(searchLower) ||
        course.courseCode.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter && this.statusFilter !== '') {
      filtered = filtered.filter(course => course.status === this.statusFilter);
    }

    this.filteredCourses = filtered;
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
          this.filterCourses();
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
          this.filterCourses();
        });
      }
    });
  }

  approve(course: CourseResponseDto): void {
    this.courseService.approvePublish(course.id).subscribe(() => {
      this.courses = this.courses.map(c =>
        c.id === course.id ? { ...c, status: 'Published', isDraft: false } : c
      );
      this.filterCourses();
    });
  }

  delete(course: CourseResponseDto): void {
    const confirmed = confirm(`Delete course "${course.courseName}"?`);
    if (!confirmed) return;
    this.courseService.deleteCourse(course.id).subscribe(() => {
      this.courses = this.courses.filter(c => c.id !== course.id);
      this.filterCourses();
    });
  }

  openYoutube(url: string): void {
    window.open(url, '_blank');
  }
}
