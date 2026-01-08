import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { InstructorCourseService, CourseResponseDto } from '../../../services/instructor-course.service';
import { CourseDetailDialogComponent } from '../../instructor/course-detail-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule
  ],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome Admin</h1>
        <p class="welcome-subtitle">Manage your learning management system</p>
      </div>

      <div class="stats-cards">
        <mat-card class="stat-card instructors-card">
          <div class="card-icon">
            <mat-icon>school</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.instructorCount || 0 }}</h3>
            <p class="stat-label">Instructors</p>
          </div>
        </mat-card>

        <mat-card class="stat-card students-card">
          <div class="card-icon">
            <mat-icon>people</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.studentCount || 0 }}</h3>
            <p class="stat-label">Students</p>
          </div>
        </mat-card>

        <mat-card class="stat-card courses-card">
          <div class="card-icon">
            <mat-icon>book</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.courseCount || 0 }}</h3>
            <p class="stat-label">Courses</p>
          </div>
        </mat-card>

        <mat-card class="stat-card enrollments-card">
          <div class="card-icon">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ stats?.enrollmentCount || 0 }}</h3>
            <p class="stat-label">Total Enrollments</p>
          </div>
        </mat-card>
      </div>

      <div class="courses-section">
        <h2 class="section-title">All Courses</h2>
        
        <div class="search-container">
          <mat-form-field class="search-field" appearance="outline">
            <input 
              matInput 
              [(ngModel)]="searchText" 
              (input)="filterCourses()" 
              placeholder="Search by course name, code or status">
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
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort class="courses-table">
            <ng-container matColumnDef="sno">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</th>
              <td mat-cell *matCellDef="let element">{{ element.sno }}</td>
            </ng-container>

            <ng-container matColumnDef="courseName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Course Name</th>
              <td mat-cell *matCellDef="let element">{{ element.courseName }}</td>
            </ng-container>

            <ng-container matColumnDef="courseCode">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Course Code</th>
              <td mat-cell *matCellDef="let element">{{ element.courseCode }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
              <td mat-cell *matCellDef="let element">
                {{ element.description.length > 60 ? (element.description.substring(0, 60) + '...') : element.description }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date Created</th>
              <td mat-cell *matCellDef="let element">{{ formatDate(element.createdAt) }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let element">
                <span 
                  class="status-badge"
                  [class.draft]="element.status === 'Draft'"
                  [class.pending]="element.status === 'Pending'"
                  [class.published]="element.status === 'Published'">
                  {{ element.status }}
                </span>
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

    .instructors-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .students-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .courses-card {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .enrollments-card {
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
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      align-items: center;
    }

    .search-field {
      flex: 1;
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

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clickable-row:hover {
      background-color: #e3f2fd !important;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  stats: DashboardStats | null = null;
  courses: CourseResponseDto[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchText: string = '';
  statusFilter: string = '';
  displayedColumns: string[] = ['sno', 'courseName', 'courseCode', 'description', 'createdAt', 'status'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private courseService: InstructorCourseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.setupCustomFilter();
    this.setupCaseInsensitiveSorting();
  }

  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterObj = JSON.parse(filter);
      const searchLower = filterObj.search.toLowerCase();
      
      let matchesSearch = true;
      if (searchLower) {
        matchesSearch = data.sno.toString().includes(searchLower) ||
                       data.courseName.toLowerCase().includes(searchLower) ||
                       data.courseCode.toLowerCase().includes(searchLower) ||
                       data.status.toLowerCase().includes(searchLower);
      }
      
      let matchesStatus = true;
      if (filterObj.status) {
        matchesStatus = data.status === filterObj.status;
      }
      
      return matchesSearch && matchesStatus;
    };
  }

  setupCaseInsensitiveSorting(): void {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value = data[sortHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Dashboard stats loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.updateDataSource();
        console.log('Courses loaded:', courses);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  updateDataSource(): void {
    const coursesWithSNo = this.courses.map((course, index) => ({
      ...course,
      sno: index + 1
    }));
    this.dataSource.data = coursesWithSNo;
    this.filterCourses();
  }

  filterCourses(): void {
    const filterValue = JSON.stringify({
      search: this.searchText.trim(),
      status: this.statusFilter
    });
    this.dataSource.filter = filterValue;
  }

  openCourseDetail(course: CourseResponseDto): void {
    this.dialog.open(CourseDetailDialogComponent, {
      width: '600px',
      data: course
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
