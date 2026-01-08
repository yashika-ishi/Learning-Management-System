import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { InstructorCourseService } from './instructor-course.service';
import { EnrollmentService } from './enrollment.service';
import { AssignmentService } from './assignment.service';
import { SubmissionService } from './submission.service';

export interface StudentDashboardStats {
  totalCoursesCount: number;
  myCoursesCount: number;
  assignmentCount: number;
  submissionCount: number;
}

@Injectable({ providedIn: 'root' })
export class StudentDashboardService {
  constructor(
    private courseService: InstructorCourseService,
    private enrollmentService: EnrollmentService,
    private assignmentService: AssignmentService,
    private submissionService: SubmissionService
  ) {}

  getDashboardStats(): Observable<StudentDashboardStats> {
    return forkJoin({
      publishedCourses: this.courseService.getPublishedCourses().pipe(catchError(() => of([]))),
      myEnrollments: this.enrollmentService.getMyEnrollments().pipe(catchError(() => of([]))),
      assignments: this.assignmentService.getAssignments().pipe(catchError(() => of([]))),
      submissions: this.submissionService.getSubmissions().pipe(catchError(() => of([])))
    }).pipe(
      map(({ publishedCourses, myEnrollments, assignments, submissions }) => ({
        totalCoursesCount: publishedCourses.length,
        myCoursesCount: myEnrollments.filter(e => e.status === 'Approved').length,
        assignmentCount: assignments.length,
        submissionCount: submissions.length
      }))
    );
  }
}
