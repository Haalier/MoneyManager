import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../features/auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  return authService.checkAuth().pipe(
    map((isLogged) => {
      if (!isLogged) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
  );
};
