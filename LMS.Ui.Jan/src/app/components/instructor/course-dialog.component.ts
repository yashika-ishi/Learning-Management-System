import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CourseCreateDto, CourseResponseDto } from '../../services/instructor-course.service';

export interface CourseDialogData {
  mode: 'create' | 'edit';
  course?: CourseResponseDto;
}

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create Course' : 'Edit Course' }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="form" class="form">
        <label>
          Course Name
          <input formControlName="courseName" />
        </label>
        <label>
          Course Code
          <input formControlName="courseCode" />
        </label>
        <label>
          Description
          <textarea formControlName="description" rows="3"></textarea>
        </label>
        <label>
          YouTube URL (optional)
          <input formControlName="youTubeUrl" />
        </label>
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
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 14px;
    }
    input, textarea {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ddd;
      margin-top: 4px;
      font: inherit;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
  `]
})
export class CourseDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData
  ) {
    this.form = this.fb.group({
      courseName: [data.course?.courseName ?? '', Validators.required],
      courseCode: [data.course?.courseCode ?? '', Validators.required],
      description: [data.course?.description ?? '', Validators.required],
      youTubeUrl: [data.course?.youTubeUrl ?? '']
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const payload = this.form.value as CourseCreateDto;
      this.dialogRef.close(payload);
    }
  }
}

