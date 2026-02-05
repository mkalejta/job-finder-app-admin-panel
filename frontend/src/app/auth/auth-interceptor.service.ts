import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ErrorAccessTokenResponseDto } from '../interface/ErrorAccessTokenResponseDto';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private isRefreshing = false;
  private readonly refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLogin = req.url.includes('/auth/login');
    const isRotate = req.url.includes('/refresh-token/rotate');
    const token = localStorage.getItem('accessToken');
    let modifiedReq = req;

    if (!isLogin && !isRotate && token) {
      modifiedReq = this.addTokenToRequest(req, token);
    }

    return next.handle(modifiedReq).pipe(
      switchMap((event: HttpEvent<unknown>) => {
        if (
          event instanceof HttpResponse &&
          !isLogin &&
          !isRotate &&
          !modifiedReq.headers.has('x-refresh-retry')
        ) {
          const body = event.body as ErrorAccessTokenResponseDto;
          const invalidCode = body.code === 'INVALID_ACCESS_TOKEN';

          if (invalidCode) {
            return this.handle401Error(modifiedReq, next);
          }
        }

        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        const errorBody = error.error as ErrorAccessTokenResponseDto | undefined;
        const shouldAttemptRefresh = !isLogin && !isRotate && ((error.status === 401 || error.status === 403) || errorBody?.code === 'INVALID_ACCESS_TOKEN');

        if (shouldAttemptRefresh) {
          return this.handle401Error(modifiedReq, next);
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
            const newToken = response.data.accessToken;
            this.refreshTokenSubject.next(newToken);

            return next.handle(this.addTokenToRequest(request, newToken, true));
          }),
          catchError((error: Error) => {
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
      filter((token: string | null): token is string => token !== null),
      take(1),
      switchMap((token: string) => next.handle(this.addTokenToRequest(request, token, true)))
    );
  }

  private addTokenToRequest(request: HttpRequest<unknown>, token: string, markRetry: boolean = false): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(markRetry ? { 'x-refresh-retry': '1' } : {})
      }
    });
  }
}
