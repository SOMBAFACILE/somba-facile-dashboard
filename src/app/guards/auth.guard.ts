import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/API/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user && user.roles.some((role: string) => allowedRoles.includes(role))) {
      return true;
    }

    // Redirection si l'accès est refusé
    return router.parseUrl('/unauthorized');
  };
};