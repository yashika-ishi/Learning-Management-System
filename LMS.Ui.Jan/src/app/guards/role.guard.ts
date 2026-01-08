import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.getRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to appropriate dashboard based on role
    const role = userRole?.toLowerCase() || '';
    if (role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (role === 'instructor') {
      router.navigate(['/instructor/dashboard']);
    } else if (role === 'student') {
      router.navigate(['/student/dashboard']);
    } else {
      router.navigate(['/login']);
    }

    return false;
  };
};
