import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true,
  })
  return next(clonedRequest);
};
