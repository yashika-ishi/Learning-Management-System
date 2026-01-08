import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssignmentResponseDto {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  instructorId: number;
  instructorName: string;
  startDate: string;
  lastDate: string;
  googleDriveLink?: string;
  createdAt: string;
  hasSubmission?: boolean;
  submissionDate?: string;
}

export interface AssignmentCreateDto {
  title: string;
  description: string;
  courseId: number;
  startDate: string;
  lastDate: string;
  googleDriveLink?: string;
}

export interface AssignmentUpdateDto extends AssignmentCreateDto {}

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly baseUrl = 'https://localhost:7234/api/assignment';

  constructor(private http: HttpClient) {}

  getAssignments(): Observable<AssignmentResponseDto[]> {
    return this.http.get<AssignmentResponseDto[]>(this.baseUrl);
  }

  getAssignmentById(id: number): Observable<AssignmentResponseDto> {
    return this.http.get<AssignmentResponseDto>(`${this.baseUrl}/${id}`);
  }

  createAssignment(payload: AssignmentCreateDto): Observable<AssignmentResponseDto> {
    return this.http.post<AssignmentResponseDto>(this.baseUrl, payload);
  }

  updateAssignment(id: number, payload: AssignmentUpdateDto): Observable<AssignmentResponseDto> {
    return this.http.put<AssignmentResponseDto>(`${this.baseUrl}/${id}`, payload);
  }

  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
