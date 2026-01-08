import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseResponseDto } from './instructor-course.service';

export interface EnrollmentResponseDto {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  description: string;
  youTubeUrl?: string;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly baseUrl = 'https://localhost:7234/api/enrollment';

  constructor(private http: HttpClient) {}

  requestEnrollment(courseId: number): Observable<EnrollmentResponseDto> {
    return this.http.post<EnrollmentResponseDto>(this.baseUrl, { courseId });
  }

  getMyEnrollments(): Observable<EnrollmentResponseDto[]> {
    return this.http.get<EnrollmentResponseDto[]>(`${this.baseUrl}/my`);
  }

  // Admin
  getAllEnrollments(): Observable<EnrollmentResponseDto[]> {
    return this.http.get<EnrollmentResponseDto[]>(`${this.baseUrl}/all`);
  }

  setApproval(enrollmentId: number, isApproved: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${enrollmentId}/approval`, { isApproved });
  }
}

