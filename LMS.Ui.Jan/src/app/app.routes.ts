import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';   
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { InstructorDashboardComponent } from './components/dashboards/instructor-dashboard/instructor-dashboard.component';
import { StudentDashboardComponent } from './components/dashboards/student-dashboard/student-dashboard.component';  
import { AdminShellComponent } from './components/layouts/admin-shell.component';
import { InstructorShellComponent } from './components/layouts/instructor-shell.component';
import { StudentShellComponent } from './components/layouts/student-shell.component';
import { ManageUsersComponent } from './components/admin/manage-users.component';
import { AdminCoursesComponent } from './components/admin/admin-courses.component';
import { AdminEnrollmentsComponent } from './components/admin/admin-enrollments.component';
import { AdminAssignmentsComponent } from './components/admin/admin-assignments.component';
import { AdminSubmissionsComponent } from './components/admin/admin-submissions.component';
import { InstructorMyCoursesComponent } from './components/instructor/instructor-my-courses.component';
import { InstructorMyAssignmentsComponent } from './components/instructor/instructor-my-assignments.component';
import { InstructorSubmissionsComponent } from './components/instructor/instructor-submissions.component';
import { StudentCoursesComponent } from './components/student/student-courses.component';
import { StudentMyCoursesComponent } from './components/student/student-my-courses.component';
import { StudentAssignmentsComponent } from './components/student/student-assignments.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['Admin'])],
    component: AdminShellComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'enrollments', component: AdminEnrollmentsComponent },
      { path: 'assignments', component: AdminAssignmentsComponent },
      { path: 'submissions', component: AdminSubmissionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'instructor',
    canActivate: [authGuard, roleGuard(['Instructor'])],
    component: InstructorShellComponent,
    children: [
      {
        path: 'dashboard',
        component: InstructorDashboardComponent
      },
      { path: 'my-courses', component: InstructorMyCoursesComponent },
      { path: 'my-assignments', component: InstructorMyAssignmentsComponent },
      { path: 'submissions', component: InstructorSubmissionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard(['Student'])],
    component: StudentShellComponent,
    children: [
      {
        path: 'dashboard',
        component: StudentDashboardComponent
      },
      { path: 'courses', component: StudentCoursesComponent },
      { path: 'my-courses', component: StudentMyCoursesComponent },
      { path: 'assignments', component: StudentAssignmentsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
