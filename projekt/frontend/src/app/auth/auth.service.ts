import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import TokenResponse from '../interface/dto/token-response';
import ResponseDto from '../interface/dto/response-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/auth/login`;

  login(credentials: { loginData: string, password: string }): Observable<{ data?: TokenResponse }> {
    return this.http.post<ResponseDto<TokenResponse>>(`${this.authUrl}`, credentials)
    .pipe(
      tap(response => {
        console.log(response);
        localStorage.setItem('accessToken', response.data!.accessToken);
        localStorage.setItem('refreshToken', response.data!.refreshToken);
        localStorage.setItem('refreshTokenId', response.data!.refreshTokenId);
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
