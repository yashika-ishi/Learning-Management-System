import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseResponseDto {
  id: number;
  courseName: string;
  courseCode: string;
  description: string;
  youTubeUrl?: string;
  isDraft: boolean;
  status: string;
  createdAt: string;
}

export interface CourseCreateDto {
  courseName: string;
  courseCode: string;
  description: string;
  youTubeUrl?: string;
}

export interface CourseUpdateDto extends CourseCreateDto {}

@Injectable({ providedIn: 'root' })
export class InstructorCourseService {
  private readonly baseUrl = 'https://localhost:7234/api/course';

  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.baseUrl}/my`);
  }

  getAllCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.baseUrl}/my`);
  }

  getPublishedCourses(): Observable<CourseResponseDto[]> {
    return this.http.get<CourseResponseDto[]>(`${this.baseUrl}/published`);
  }

  createCourse(payload: CourseCreateDto): Observable<CourseResponseDto> {
    return this.http.post<CourseResponseDto>(this.baseUrl, payload);
  }

  updateCourse(id: number, payload: CourseUpdateDto): Observable<CourseResponseDto> {
    return this.http.put<CourseResponseDto>(`${this.baseUrl}/${id}`, payload);
  }

  requestPublish(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/request-publish`, {});
  }

  approvePublish(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/approve-publish`, {});
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

