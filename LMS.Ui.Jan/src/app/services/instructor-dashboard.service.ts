import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { InstructorCourseService } from './instructor-course.service';
import { EnrollmentService } from './enrollment.service';
import { AssignmentService } from './assignment.service';

export interface InstructorDashboardStats {
  totalPublishedCoursesCount: number;
  myCoursesCount: number;
  myPublishedCoursesCount: number;
  assignmentCount: number;
}

@Injectable({ providedIn: 'root' })
export class InstructorDashboardService {
  constructor(
    private courseService: InstructorCourseService,
    private enrollmentService: EnrollmentService,
    private assignmentService: AssignmentService
  ) {}

  getDashboardStats(): Observable<InstructorDashboardStats> {
    return forkJoin({
      myCourses: this.courseService.getMyCourses().pipe(catchError(() => of([]))),
      publishedCourses: this.courseService.getPublishedCourses().pipe(catchError(() => of([]))),
      enrollments: this.enrollmentService.getAllEnrollments().pipe(catchError(() => of([]))),
      assignments: this.assignmentService.getAssignments().pipe(catchError(() => of([])))
    }).pipe(
      map(({ myCourses, publishedCourses, enrollments, assignments }) => {
        // Count instructor's published courses
        const myPublishedCourses = myCourses.filter(c => c.status === 'Published');

        return {
          totalPublishedCoursesCount: publishedCourses.length, // All published courses in the system
          myCoursesCount: myCourses.length, // All courses created by instructor
          myPublishedCoursesCount: myPublishedCourses.length, // Only instructor's published courses
          assignmentCount: assignments.length // All assignments created by instructor
        };
      })
    );
  }
}
