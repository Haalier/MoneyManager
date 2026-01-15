import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { LoadingService } from '../shared/services/loading-service';
import { catchError, finalize, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(HotToastService);
  const loadingService = inject(LoadingService);

  loadingService.setLoading(true);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || error.message || 'An unexpected error has occurred';
      toast.error(message);

      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.setLoading(false);
    }),
  );
};
