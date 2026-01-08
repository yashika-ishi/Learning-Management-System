import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminUserService, UserListDto } from '../../services/admin-user.service';
import { ManageUserDialogComponent } from './manage-user-dialog.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  template: `
    <div class="page">
      <div class="welcome-section">
        <h1 class="welcome-title">Manage Users</h1>
        <p class="welcome-subtitle">Manage system users and permissions</p>
      </div>

      <div class="search-container">
        <mat-form-field class="search-field" appearance="outline">
          <input 
            matInput 
            [(ngModel)]="searchText" 
            (input)="filterUsers()" 
            placeholder="Search by name, email, role or approval status">
          <mat-icon matSuffix class="search-icon">search</mat-icon>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2 full-width-table">
        <ng-container matColumnDef="sno">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>S.No.</th>
          <td mat-cell *matCellDef="let user">{{ user.sno }}</td>
        </ng-container>

        <ng-container matColumnDef="firstName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>User First Name</th>
          <td mat-cell *matCellDef="let user">{{ user.firstName }}</td>
        </ng-container>

        <ng-container matColumnDef="lastName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>User Last Name</th>
          <td mat-cell *matCellDef="let user">{{ user.lastName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
          <td mat-cell *matCellDef="let user">{{ user.email }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
          <td mat-cell *matCellDef="let user">
            <mat-radio-group
              [value]="user.role"
              (change)="onRoleChange(user, $event.value)"
              class="role-group"
            >
              <mat-radio-button value="Student">Student</mat-radio-button>
              <mat-radio-button value="Instructor">Instructor</mat-radio-button>
            </mat-radio-group>
          </td>
        </ng-container>

        <ng-container matColumnDef="approval">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Approval</th>
          <td mat-cell *matCellDef="let user">
            <button
              mat-raised-button
              color="primary"
              class="btn-small"
              [disabled]="user.isApproved"
              (click)="setApproval(user, true)"
            >
              Approve
            </button>
            <button
              mat-stroked-button
              color="warn"
              class="btn-small"
              [disabled]="!user.isApproved"
              (click)="setApproval(user, false)"
            >
              Disapprove
            </button>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let user">
            <button mat-icon-button color="primary" (click)="editUser(user)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(user)">
              <mat-icon>delete</mat-icon>
            </button>
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
    .search-container {
      margin-bottom: 20px;
    }
    .search-field {
      width: 100%;
      max-width: 500px;
    }
    .search-icon {
      color: #667eea;
      cursor: pointer;
    }
    .full-width-table {
      width: 100%;
    }
    th.mat-header-cell {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-weight: 600;
    }
    td.mat-cell {
      vertical-align: middle;
    }
    .role-group {
      display: flex;
      gap: 8px;
    }
    .btn-small {
      margin-right: 6px;
      min-width: 80px;
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  displayedColumns = ['sno', 'firstName', 'lastName', 'email', 'role', 'approval', 'actions'];
  users: UserListDto[] = [];
  dataSource = new MatTableDataSource<any>([]);
  searchText: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminUserService: AdminUserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.setupCustomFilter();
    this.setupCaseInsensitiveSorting();
  }

  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.sno.toString().includes(searchStr) ||
             data.firstName.toLowerCase().includes(searchStr) ||
             data.lastName.toLowerCase().includes(searchStr) ||
             data.email.toLowerCase().includes(searchStr) ||
             data.role.toLowerCase().includes(searchStr) ||
             (data.isApproved ? 'approved' : 'not approved').includes(searchStr) ||
             (data.isApproved ? 'approve' : 'disapprove').includes(searchStr);
    };
  }

  setupCaseInsensitiveSorting(): void {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value = data[sortHeaderId];
      if (sortHeaderId === 'approval') {
        return data.isApproved ? 1 : 0;
      }
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  loadUsers(): void {
    this.adminUserService.getUsers().subscribe(users => {
      // Filter out admin users
      this.users = users.filter(user => user.role !== 'Admin');
      this.updateDataSource();
    });
  }

  updateDataSource(): void {
    const usersWithSNo = this.users.map((user, index) => ({
      ...user,
      sno: index + 1
    }));
    this.dataSource.data = usersWithSNo;
  }

  filterUsers(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onRoleChange(user: any, roleLabel: 'Student' | 'Instructor'): void {
    const roleId = roleLabel === 'Student' ? 3 : 2;
    this.adminUserService.updateRole(user.id, roleId).subscribe(() => {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        this.users[index].role = roleLabel;
        this.updateDataSource();
        this.filterUsers();
      }
    });
  }

  setApproval(user: any, isApproved: boolean): void {
    this.adminUserService.updateApproval(user.id, isApproved).subscribe(() => {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        this.users[index].isApproved = isApproved;
        this.updateDataSource();
        this.filterUsers();
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(ManageUserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminUserService
          .updateUser(user.id, {
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email
          })
          .subscribe(updated => {
            const index = this.users.findIndex(u => u.id === user.id);
            if (index >= 0) {
              this.users = this.users.map(u => u.id === updated.id ? updated : u);
              this.updateDataSource();
              this.filterUsers();
            }
          });
      }
    });
  }

  deleteUser(user: any): void {
    const confirmed = confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);
    if (!confirmed) return;

    this.adminUserService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
      this.updateDataSource();
      this.filterUsers();
    });
  }
}
