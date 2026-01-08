import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { AdminUserService } from './admin-user.service';
import { InstructorCourseService } from './instructor-course.service';
import { EnrollmentService } from './enrollment.service';

export interface DashboardStats {
  instructorCount: number;
  studentCount: number;
  courseCount: number;
  enrollmentCount: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private userService: AdminUserService,
    private courseService: InstructorCourseService,
    private enrollmentService: EnrollmentService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      users: this.userService.getUsers().pipe(catchError(() => of([]))),
      courses: this.courseService.getAllCourses().pipe(catchError(() => of([]))),
      enrollments: this.enrollmentService.getAllEnrollments().pipe(catchError(() => of([])))
    }).pipe(
      map(({ users, courses, enrollments }) => ({
        instructorCount: users.filter(u => u.role === 'Instructor').length,
        studentCount: users.filter(u => u.role === 'Student').length,
        courseCount: courses.length,
        enrollmentCount: enrollments.length
      }))
    );
  }
}
