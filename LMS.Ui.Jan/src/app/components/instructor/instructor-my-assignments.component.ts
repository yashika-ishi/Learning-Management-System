import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentService, AssignmentResponseDto, AssignmentCreateDto } from '../../services/assignment.service';
import { AssignmentDialogComponent } from './assignment-dialog.component';
import { AssignmentDetailDialogComponent } from './assignment-detail-dialog.component';

@Component({
  selector: 'app-instructor-my-assignments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">My Assignments</h1>
        <p class="welcome-subtitle">Create and manage your assignments</p>
      </div>

      <div class="search-action-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="applyFilter()"
            placeholder="Search by assignment title or description">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="openCreate()" class="create-button">
          <mat-icon>add</mat-icon>
          Create
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" matSort class="assignments-table">
          <ng-container matColumnDef="sno">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</th>
            <td mat-cell *matCellDef="let element">{{ element.sno }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Assignment Title</th>
            <td mat-cell *matCellDef="let element">{{ element.title }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
            <td mat-cell *matCellDef="let element">
              {{ element.description.length > 50 ? (element.description.substring(0, 50) + '...') : element.description }}
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date of Creation</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.createdAt) }}</td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Start Date</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.startDate) }}</td>
          </ng-container>

          <ng-container matColumnDef="lastDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Date</th>
            <td mat-cell *matCellDef="let element">{{ formatDate(element.lastDate) }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="openEdit(element)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(element)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
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
  `]
})
export class InstructorMyAssignmentsComponent implements OnInit {
  assignments: AssignmentResponseDto[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['sno', 'title', 'description', 'createdAt', 'startDate', 'lastDate', 'actions'];
  searchText: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private assignmentService: AssignmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
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
        data.title?.toLowerCase().includes(searchStr) ||
        data.description?.toLowerCase().includes(searchStr)
      );
    };
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
      this.updateDataSource();
    });
  }

  updateDataSource(): void {
    const assignmentsWithSNo = this.assignments.map((assignment, index) => ({
      ...assignment,
      sno: index + 1
    }));
    this.dataSource.data = assignmentsWithSNo;
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '600px',
      data: { mode: 'create', isAdmin: false }
    });

    dialogRef.afterClosed().subscribe((payload?: AssignmentCreateDto) => {
      if (payload) {
        this.assignmentService.createAssignment(payload).subscribe(created => {
          this.assignments = [...this.assignments, created];
          this.updateDataSource();
        });
      }
    });
  }

  openEdit(assignment: any): void {
    event?.stopPropagation();
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '600px',
      data: { mode: 'edit', assignment, isAdmin: false }
    });

    dialogRef.afterClosed().subscribe((payload?: AssignmentCreateDto) => {
      if (payload) {
        this.assignmentService.updateAssignment(assignment.id, payload).subscribe(updated => {
          this.assignments = this.assignments.map(a => (a.id === updated.id ? updated : a));
          this.updateDataSource();
        });
      }
    });
  }

  delete(assignment: any): void {
    event?.stopPropagation();
    const confirmed = confirm(`Delete assignment "${assignment.title}"?`);
    if (!confirmed) return;
    this.assignmentService.deleteAssignment(assignment.id).subscribe(() => {
      this.assignments = this.assignments.filter(a => a.id !== assignment.id);
      this.updateDataSource();
    });
  }

  openDetail(assignment: AssignmentResponseDto): void {
    this.dialog.open(AssignmentDetailDialogComponent, {
      width: '600px',
      data: { assignment }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
