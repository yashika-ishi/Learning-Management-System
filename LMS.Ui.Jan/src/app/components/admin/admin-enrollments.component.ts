import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EnrollmentService, EnrollmentResponseDto } from '../../services/enrollment.service';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">Enrollments</h1>
        <p class="welcome-subtitle">Manage student course enrollments</p>
      </div>

      <div class="search-filter-container">
        <mat-form-field class="search-field" appearance="outline">
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="filterEnrollments()" 
            placeholder="Search by name, course code, course name or status">
          <mat-icon matSuffix class="search-icon">search</mat-icon>
        </mat-form-field>

        <mat-form-field class="filter-field" appearance="outline">
          <mat-select 
            [(ngModel)]="statusFilter" 
            (selectionChange)="filterEnrollments()" 
            placeholder="Filter by status">
            <mat-option value="">All Status</mat-option>
            <mat-option value="Approved">Approved</mat-option>
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="Disapproved">Disapproved</mat-option>
          </mat-select>
          <mat-icon matPrefix class="filter-icon">filter_list</mat-icon>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2 full-width-table">
        <ng-container matColumnDef="sno">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</th>
          <td mat-cell *matCellDef="let e">{{ e.sno }}</td>
        </ng-container>
        <ng-container matColumnDef="firstName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>First Name</th>
          <td mat-cell *matCellDef="let e">{{ e.studentFirstName }}</td>
        </ng-container>
        <ng-container matColumnDef="lastName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Name</th>
          <td mat-cell *matCellDef="let e">{{ e.studentLastName }}</td>
        </ng-container>
        <ng-container matColumnDef="courseCode">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Course Code</th>
          <td mat-cell *matCellDef="let e">{{ e.courseCode }}</td>
        </ng-container>
        <ng-container matColumnDef="courseName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Course Name</th>
          <td mat-cell *matCellDef="let e">{{ e.courseName }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
          <td mat-cell *matCellDef="let e">
            <button mat-raised-button color="primary" class="btn-small" (click)="setStatus(e, true)">
              Approve
            </button>
            <button mat-stroked-button color="warn" class="btn-small" (click)="setStatus(e, false)">
              Disapprove
            </button>
            <span class="status-label">{{ e.status }}</span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
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
    .full-width-table { width: 100%; }
    th.mat-header-cell {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-weight: 600;
    }
    td.mat-cell { vertical-align: middle; }
    .btn-small { margin-right: 6px; }
    .status-label { margin-left: 8px; font-weight: 600; }
  `]
})
export class AdminEnrollmentsComponent implements OnInit {
  enrollments: EnrollmentResponseDto[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchText: string = '';
  statusFilter: string = '';
  displayedColumns = ['sno', 'firstName', 'lastName', 'courseCode', 'courseName', 'status'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.load();
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
                       data.studentFirstName.toLowerCase().includes(searchLower) ||
                       data.studentLastName.toLowerCase().includes(searchLower) ||
                       data.courseCode.toLowerCase().includes(searchLower) ||
                       data.courseName.toLowerCase().includes(searchLower) ||
                       data.description.toLowerCase().includes(searchLower) ||
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

  load(): void {
    this.enrollmentService.getAllEnrollments().subscribe(enrs => {
      this.enrollments = enrs;
      this.updateDataSource();
    });
  }

  updateDataSource(): void {
    const enrollmentsWithSNo = this.enrollments.map((enr, index) => ({
      ...enr,
      sno: index + 1
    }));
    this.dataSource.data = enrollmentsWithSNo;
  }

  filterEnrollments(): void {
    const filterValue = JSON.stringify({
      search: this.searchText.trim(),
      status: this.statusFilter
    });
    this.dataSource.filter = filterValue;
  }

  setStatus(enr: any, isApproved: boolean): void {
    this.enrollmentService.setApproval(enr.id, isApproved).subscribe(() => {
      const index = this.enrollments.findIndex(e => e.id === enr.id);
      if (index >= 0) {
        this.enrollments[index].status = isApproved ? 'Approved' : 'Disapproved';
        this.updateDataSource();
        this.filterEnrollments();
      }
    });
  }
}
