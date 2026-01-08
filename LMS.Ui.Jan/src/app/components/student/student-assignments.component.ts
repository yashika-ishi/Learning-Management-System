import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentService, AssignmentResponseDto } from '../../services/assignment.service';
import { SubmissionService, SubmissionCreateDto } from '../../services/submission.service';
import { AssignmentDetailDialogComponent } from '../instructor/assignment-detail-dialog.component';
import { SubmissionDialogComponent } from './submission-dialog.component';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">Assignments</h1>
        <p class="welcome-subtitle">View and submit your assignments</p>
      </div>

      <div class="search-filter-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="applyFilters()"
            placeholder="Search by assignment title">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-icon matPrefix>filter_list</mat-icon>
          <mat-label>Filter by status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
            <mat-option value="">All</mat-option>
            <mat-option value="submitted">Submitted</mat-option>
            <mat-option value="not-submitted">Not Submitted</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="filteredAssignments" class="assignments-table">
          <ng-container matColumnDef="sno">
            <th mat-header-cell *matHeaderCellDef>S.No.</th>
            <td mat-cell *matCellDef="let element; let i = index">{{ i + 1 }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Assignment Title</th>
            <td mat-cell *matCellDef="let element">{{ element.title }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let element">
              {{ element.description.length > 50 ? (element.description.substring(0, 50) + '...') : element.description }}
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Date of Creation</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.createdAt) }}</td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef>Start Date</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.startDate) }}</td>
          </ng-container>

          <ng-container matColumnDef="lastDate">
            <th mat-header-cell *matHeaderCellDef>Last Date</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.lastDate) }}</td>
          </ng-container>

          <ng-container matColumnDef="submit">
            <th mat-header-cell *matHeaderCellDef>Submit Assignment</th>
            <td mat-cell *matCellDef="let element">
              <div class="submit-cell">
                <button 
                  *ngIf="!element.hasSubmission" 
                  mat-raised-button 
                  color="primary" 
                  (click)="openSubmit(element)"
                  matTooltip="Submit Assignment">
                  Submit Assignment
                </button>
                <div *ngIf="element.hasSubmission" class="submitted-info">
                  <span class="submitted-text">Submitted</span>
                  <span class="submitted-date">{{ getSubmissionDate(element) }}</span>
                </div>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openDetail(row)" class="clickable-row"></tr>
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
    .search-filter-container {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
    }
    .search-field {
      max-width: 500px;
      flex: 1;
    }
    .filter-field {
      min-width: 200px;
    }
    .table-container {
      overflow-x: auto;
    }
    .assignments-table {
      width: 100%;
    }
    .clickable-row {
      cursor: pointer;
    }
    .clickable-row:hover {
      background-color: #f5f5f5;
    }
    th, td {
      padding: 12px;
      text-align: left;
    }
    .submit-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .submitted-info {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .submitted-text {
      color: #0f766e;
      font-weight: 500;
    }
    .submitted-date {
      font-size: 10px;
      color: #666;
    }
  `]
})
export class StudentAssignmentsComponent implements OnInit {
  assignments: AssignmentResponseDto[] = [];
  filteredAssignments: AssignmentResponseDto[] = [];
  displayedColumns: string[] = ['sno', 'title', 'description', 'createdAt', 'startDate', 'lastDate', 'submit'];
  searchText: string = '';
  statusFilter: string = '';

  constructor(
    private assignmentService: AssignmentService,
    private submissionService: SubmissionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
      this.filteredAssignments = assignments;
    });
  }

  applyFilters(): void {
    let filtered = this.assignments;

    // Apply search filter
    const searchStr = this.searchText.trim().toLowerCase();
    if (searchStr) {
      filtered = filtered.filter(assignment =>
        assignment.title?.toLowerCase().includes(searchStr)
      );
    }

    // Apply status filter
    if (this.statusFilter === 'submitted') {
      filtered = filtered.filter(assignment => assignment.hasSubmission);
    } else if (this.statusFilter === 'not-submitted') {
      filtered = filtered.filter(assignment => !assignment.hasSubmission);
    }

    this.filteredAssignments = filtered;
  }

  openSubmit(assignment: AssignmentResponseDto): void {
    event?.stopPropagation();
    const dialogRef = this.dialog.open(SubmissionDialogComponent, {
      width: '600px',
      data: { assignment }
    });

    dialogRef.afterClosed().subscribe((payload?: SubmissionCreateDto) => {
      if (payload) {
        this.submissionService.createSubmission(payload).subscribe(() => {
          // Reload assignments to update hasSubmission flag
          this.assignmentService.getAssignments().subscribe(assignments => {
            this.assignments = assignments;
            this.applyFilters();
          });
        });
      }
    });
  }

  openDetail(assignment: AssignmentResponseDto): void {
    this.dialog.open(AssignmentDetailDialogComponent, {
      width: '600px',
      data: { assignment }
    });
  }

  getSubmissionDate(assignment: AssignmentResponseDto): string {
    return assignment.submissionDate ? this.formatDate(assignment.submissionDate) : '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
