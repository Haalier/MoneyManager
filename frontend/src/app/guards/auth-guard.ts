import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../features/auth/auth-service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const authService = inject(AuthService);

return authService.checkAuth().pipe(
    tap((isLogged) => {
      if (!isLogged) {
        router.navigate(['/login']);
      }
    })
  );

};
