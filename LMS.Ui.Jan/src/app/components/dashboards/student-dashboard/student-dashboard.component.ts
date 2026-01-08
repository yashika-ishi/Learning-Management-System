import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { StudentDashboardService, StudentDashboardStats } from '../../../services/student-dashboard.service';
import { InstructorCourseService, CourseResponseDto } from '../../../services/instructor-course.service';
import { CourseDetailDialogComponent } from '../../instructor/course-detail-dialog.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome Student</h1>
        <p class="welcome-subtitle">Explore courses and complete your assignments</p>
      </div>

      <div class="stats-cards">
        <mat-card class="stat-card courses-card">
          <div class="card-icon">
            <mat-icon>book</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.totalCoursesCount || 0 }}</h3>
            <p class="stat-label">Total Courses</p>
          </div>
        </mat-card>

        <mat-card class="stat-card my-courses-card">
          <div class="card-icon">
            <mat-icon>class</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.myCoursesCount || 0 }}</h3>
            <p class="stat-label">My Courses</p>
          </div>
        </mat-card>

        <mat-card class="stat-card assignments-card">
          <div class="card-icon">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.assignmentCount || 0 }}</h3>
            <p class="stat-label">My Assignments</p>
          </div>
        </mat-card>

        <mat-card class="stat-card submissions-card">
          <div class="card-icon">
            <mat-icon>done_all</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.submissionCount || 0 }}</h3>
            <p class="stat-label">Submissions Done</p>
          </div>
        </mat-card>
      </div>

      <div class="courses-section">
        <h2 class="section-title">Published Courses</h2>
        
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input 
              matInput 
              [(ngModel)]="searchText" 
              (input)="applyFilter()"
              placeholder="Search by course name, code or description">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="filteredCourses" class="courses-table">
            <ng-container matColumnDef="sno">
              <th mat-header-cell *matHeaderCellDef>S.No.</th>
              <td mat-cell *matCellDef="let element; let i = index">{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="courseName">
              <th mat-header-cell *matHeaderCellDef>Course Name</th>
              <td mat-cell *matCellDef="let element">{{ element.courseName }}</td>
            </ng-container>

            <ng-container matColumnDef="courseCode">
              <th mat-header-cell *matHeaderCellDef>Course Code</th>
              <td mat-cell *matCellDef="let element">{{ element.courseCode }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let element">
                {{ element.description.length > 60 ? (element.description.substring(0, 60) + '...') : element.description }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr 
              mat-row 
              *matRowDef="let row; columns: displayedColumns"
              (click)="openCourseDetail(row)"
              class="clickable-row">
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 0;
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

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    @media (max-width: 1200px) {
      .stats-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .stats-cards {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      padding: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
      animation: scaleIn 0.5s ease-out backwards;
    }

    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .courses-card {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .my-courses-card {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .assignments-card {
      background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      color: white;
    }

    .submissions-card {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .card-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .card-content {
      flex: 1;
    }

    .stat-number {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
    }

    .stat-label {
      margin: 4px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .courses-section {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      animation: slideUp 0.7s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-title {
      margin: 0 0 20px 0;
      color: #2d2f31;
      font-size: 24px;
      font-weight: 600;
    }

    .search-container {
      margin-bottom: 20px;
    }

    .search-field {
      max-width: 500px;
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .courses-table {
      width: 100%;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2d2f31;
    }

    th, td {
      padding: 16px;
      text-align: left;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clickable-row:hover {
      background-color: #e3f2fd !important;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  user: any = null;
  stats: StudentDashboardStats | null = null;
  publishedCourses: CourseResponseDto[] = [];
  filteredCourses: CourseResponseDto[] = [];
  displayedColumns: string[] = ['sno', 'courseName', 'courseCode', 'description'];
  searchText: string = '';

  constructor(
    private authService: AuthService,
    private dashboardService: StudentDashboardService,
    private courseService: InstructorCourseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Student dashboard stats loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading student dashboard stats:', error);
      }
    });

    this.courseService.getPublishedCourses().subscribe({
      next: (courses) => {
        this.publishedCourses = courses;
        this.filteredCourses = courses;
        console.log('Published courses loaded:', courses);
      },
      error: (error) => {
        console.error('Error loading published courses:', error);
      }
    });
  }

  applyFilter(): void {
    const searchStr = this.searchText.trim().toLowerCase();
    if (!searchStr) {
      this.filteredCourses = this.publishedCourses;
      return;
    }
    this.filteredCourses = this.publishedCourses.filter(course =>
      course.courseName?.toLowerCase().includes(searchStr) ||
      course.courseCode?.toLowerCase().includes(searchStr) ||
      course.description?.toLowerCase().includes(searchStr)
    );
  }

  openCourseDetail(course: CourseResponseDto): void {
    this.dialog.open(CourseDetailDialogComponent, {
      width: '600px',
      data: course
    });
  }
}
