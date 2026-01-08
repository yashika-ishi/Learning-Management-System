import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AssignmentCreateDto, AssignmentResponseDto } from '../../services/assignment.service';
import { InstructorCourseService, CourseResponseDto } from '../../services/instructor-course.service';

export interface AssignmentDialogData {
  mode: 'create' | 'edit';
  assignment?: AssignmentResponseDto;
  isAdmin?: boolean;
}

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create Assignment' : 'Edit Assignment' }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Assignment Title</mat-label>
          <input matInput formControlName="title" />
          <mat-error *ngIf="form.get('title')?.hasError('required')">Title is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Assignment Description</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
          <mat-error *ngIf="form.get('description')?.hasError('required')">Description is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Course</mat-label>
          <mat-select formControlName="courseId">
            <mat-option *ngFor="let course of courses" [value]="course.id">
              {{ course.courseName }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('courseId')?.hasError('required')">Course is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="startDate" />
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
          <mat-error *ngIf="form.get('startDate')?.hasError('required')">Start date is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Date</mat-label>
          <input matInput [matDatepicker]="lastPicker" formControlName="lastDate" />
          <mat-datepicker-toggle matIconSuffix [for]="lastPicker"></mat-datepicker-toggle>
          <mat-datepicker #lastPicker></mat-datepicker>
          <mat-error *ngIf="form.get('lastDate')?.hasError('required')">Last date is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Google Drive Link (optional)</mat-label>
          <input matInput formControlName="googleDriveLink" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="actions">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
        {{ data.mode === 'create' ? 'Create' : 'Save' }}
      </button>
    </div>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
      min-width: 500px;
    }
    mat-form-field {
      width: 100%;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
  `]
})
export class AssignmentDialogComponent implements OnInit {
  form: FormGroup;
  courses: CourseResponseDto[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignmentDialogData,
    private courseService: InstructorCourseService
  ) {
    this.form = this.fb.group({
      title: [data.assignment?.title ?? '', Validators.required],
      description: [data.assignment?.description ?? '', Validators.required],
      courseId: [data.assignment?.courseId ?? null, Validators.required],
      startDate: [data.assignment ? new Date(data.assignment.startDate) : null, Validators.required],
      lastDate: [data.assignment ? new Date(data.assignment.lastDate) : null, Validators.required],
      googleDriveLink: [data.assignment?.googleDriveLink ?? '']
    });
  }

  ngOnInit(): void {
    if (this.data.isAdmin) {
      this.courseService.getAllCourses().subscribe(courses => {
        this.courses = courses;
      });
    } else {
      this.courseService.getMyCourses().subscribe(courses => {
        this.courses = courses;
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload: AssignmentCreateDto = {
        title: formValue.title,
        description: formValue.description,
        courseId: formValue.courseId,
        startDate: formValue.startDate.toISOString(),
        lastDate: formValue.lastDate.toISOString(),
        googleDriveLink: formValue.googleDriveLink || undefined
      };
      this.dialogRef.close(payload);
    }
  }
}
