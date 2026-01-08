import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserListDto } from '../../services/admin-user.service';

@Component({
  selector: 'app-manage-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" class="form">
        <label>
          First Name
          <input formControlName="firstName" />
        </label>
        <label>
          Last Name
          <input formControlName="lastName" />
        </label>
        <label>
          Email
          <input formControlName="email" />
        </label>
      </form>
    </div>
    <div mat-dialog-actions class="actions">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
        Save
      </button>
    </div>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 14px;
    }
    input {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ddd;
      margin-top: 4px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
  `]
})
export class ManageUserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserListDto
  ) {
    this.form = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}

