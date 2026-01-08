// jwt.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/API/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // 1. Injection du token si présent
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 2. Si le token est expiré (401)
      if (error.status === 401 && !req.url.includes('/token/refresh')) {
        return handleRefresh(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

// Logique de rafraîchissement automatique
function handleRefresh(req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) {
  const refreshToken = authService.getRefreshToken();
  
  // Appeler l'API Symfony pour obtenir un nouveau token
  return authService.refreshTokenApi(refreshToken).pipe(
    switchMap((res: any) => {
      authService.saveTokens(res.token, res.refresh_token);
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${res.token}` }
      });
      return next(newReq);
    }),
    catchError((err) => {
      authService.logout(); // Si le refresh token est aussi expiré, on déconnecte
      return throwError(() => err);
    })
  );
}