import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubmissionService, SubmissionResponseDto } from '../../services/submission.service';

@Component({
  selector: 'app-instructor-submissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">Submissions</h1>
        <p class="welcome-subtitle">View and manage assignment submissions</p>
      </div>

      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="applyFilter()"
            placeholder="Search by name, course, assignment or solution">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" matSort class="submissions-table">
          <ng-container matColumnDef="sno">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</th>
            <td mat-cell *matCellDef="let element">{{ element.sno }}</td>
          </ng-container>

          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>First Name</th>
            <td mat-cell *matCellDef="let element">{{ element.studentFirstName }}</td>
          </ng-container>

          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Name</th>
            <td mat-cell *matCellDef="let element">{{ element.studentLastName }}</td>
          </ng-container>

          <ng-container matColumnDef="courseName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Course Name</th>
            <td mat-cell *matCellDef="let element">{{ element.courseName }}</td>
          </ng-container>

          <ng-container matColumnDef="assignmentTitle">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Assignment Title</th>
            <td mat-cell *matCellDef="let element">{{ element.assignmentTitle }}</td>
          </ng-container>

          <ng-container matColumnDef="solution">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Solution</th>
            <td mat-cell *matCellDef="let element">
              {{ element.solution.length > 50 ? (element.solution.substring(0, 50) + '...') : element.solution }}
            </td>
          </ng-container>

          <ng-container matColumnDef="submittedAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date of Submission</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.submittedAt) }}</td>
          </ng-container>

          <ng-container matColumnDef="googleDriveLink">
            <th mat-header-cell *matHeaderCellDef>Google Drive Link</th>
            <td mat-cell *matCellDef="let element">
              <a *ngIf="element.googleDriveLink" [href]="element.googleDriveLink" target="_blank" class="drive-link">
                <mat-icon>link</mat-icon>
                Open
              </a>
              <span *ngIf="!element.googleDriveLink">-</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
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
    .submissions-table {
      width: 100%;
    }
    th, td {
      padding: 12px;
      text-align: left;
    }
    .drive-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #1976d2;
      text-decoration: none;
    }
    .drive-link:hover {
      text-decoration: underline;
    }
  `]
})
export class InstructorSubmissionsComponent implements OnInit {
  submissions: SubmissionResponseDto[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['sno', 'firstName', 'lastName', 'courseName', 'assignmentTitle', 'solution', 'submittedAt', 'googleDriveLink'];
  searchText: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.setupCaseInsensitiveSorting();
    this.setupCustomFilter();
  }

  setupCaseInsensitiveSorting(): void {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value = data[sortHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.studentFirstName?.toLowerCase().includes(searchStr) ||
        data.studentLastName?.toLowerCase().includes(searchStr) ||
        data.courseName?.toLowerCase().includes(searchStr) ||
        data.assignmentTitle?.toLowerCase().includes(searchStr) ||
        data.solution?.toLowerCase().includes(searchStr)
      );
    };
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim();
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe(submissions => {
      this.submissions = submissions;
      this.updateDataSource();
    });
  }

  updateDataSource(): void {
    const submissionsWithSNo = this.submissions.map((submission, index) => ({
      ...submission,
      sno: index + 1
    }));
    this.dataSource.data = submissionsWithSNo;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
