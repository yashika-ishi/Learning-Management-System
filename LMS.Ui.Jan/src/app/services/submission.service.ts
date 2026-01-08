import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubmissionResponseDto {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  courseName: string;
  submissionTitle: string;
  solution: string;
  googleDriveLink?: string;
  submittedAt: string;
}

export interface SubmissionCreateDto {
  assignmentId: number;
  submissionTitle: string;
  solution: string;
  googleDriveLink?: string;
}

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly baseUrl = 'https://localhost:7234/api/submission';

  constructor(private http: HttpClient) {}

  getSubmissions(): Observable<SubmissionResponseDto[]> {
    return this.http.get<SubmissionResponseDto[]>(this.baseUrl);
  }

  getSubmissionById(id: number): Observable<SubmissionResponseDto> {
    return this.http.get<SubmissionResponseDto>(`${this.baseUrl}/${id}`);
  }

  createSubmission(payload: SubmissionCreateDto): Observable<SubmissionResponseDto> {
    return this.http.post<SubmissionResponseDto>(this.baseUrl, payload);
  }
}
