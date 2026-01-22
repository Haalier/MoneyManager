import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from '../services/loading-service';
import { SKIP_LOADING } from '../context/loading.context';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(HotToastService);
  const loadingService = inject(LoadingService);

  const skipLoading = req.context.get(SKIP_LOADING);

  if (!skipLoading) {
    loadingService.setLoading(true);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || error.message || 'An unexpected error has occurred';
      console.error(message);

      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.setLoading(false);
    }),
  );
};
