import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'token'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("TOKEN in INTERCEPTOR: ", token);

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(clonedRequest);
  }

  return next(req);
};