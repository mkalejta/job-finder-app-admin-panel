import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import TokenResponse from '../interface/token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/auth/login`;
  
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  login(credentials: { loginData: string, password: string }): Observable<{ data?: TokenResponse }> {
    return this.http.post<{ data?: TokenResponse }>(`${this.authUrl}`, credentials, { headers: this.headers })
    .pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.data!.accessToken);
        localStorage.setItem('refreshToken', response.data!.refreshToken);
        localStorage.setItem('refreshTokenId', response.data!.refreshTokenId);
        console.log(response)
        })
    );
  }

  logout(): void{
    localStorage.removeItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
