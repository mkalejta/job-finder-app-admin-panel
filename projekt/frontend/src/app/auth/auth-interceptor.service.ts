import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import ErrorAccessTokenResponseDto from '../interface/ErrorAccessTokenResponseDto';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLogin = req.url.includes('/auth/login');
    const isRotate = req.url.includes('/refresh-token/rotate');
    const token = localStorage.getItem('accessToken');

    if (!isLogin && !isRotate && token) {
      req = this.addTokenToRequest(req, token);
    }

    return next.handle(req).pipe(
      switchMap((event) => {
        if (
          event instanceof HttpResponse &&
          !isLogin &&
          !isRotate &&
          !req.headers.has('x-refresh-retry')
        ) {
          const body: ErrorAccessTokenResponseDto = event.body;
          const invalidCode = body && body.code === 'INVALID_ACCESS_TOKEN';

          if (invalidCode) {
            return this.handle401Error(req, next);
          }
        }

        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        const shouldAttemptRefresh = !isLogin && !isRotate && ((error.status === 401 || error.status === 403) || error.error?.code === 'INVALID_ACCESS_TOKEN');

        if (shouldAttemptRefresh) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');
      const refreshTokenId = localStorage.getItem('refreshTokenId');

      if (refreshToken && refreshTokenId) {
        return this.authService.rotateTokens({ refreshToken, refreshTokenId }).pipe(
          switchMap((response) => {
            this.isRefreshing = false;
            const newToken = response.data!.accessToken;
            this.refreshTokenSubject.next(newToken);

            return next.handle(this.addTokenToRequest(request, newToken, true));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => error);
          })
        );
      }

      this.isRefreshing = false;
      this.authService.logout();
      return throwError(() => new Error('Brak tokenu odświeżania'));
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenToRequest(request, token!, true)))
    );
  }

  private addTokenToRequest(request: HttpRequest<unknown>, token: string, markRetry = false): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(markRetry ? { 'x-refresh-retry': '1' } : {})
      }
    });
  }
}
