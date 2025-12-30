import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const isLogin = req.url.includes('/auth/login');
    const token = localStorage.getItem('accessToken');

    if (!isLogin && token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(req);
  }
}
