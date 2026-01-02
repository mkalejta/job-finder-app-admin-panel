import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import TokenResponse from '../interface/token-response';
import ResponseDto from '../interface/response-dto';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface RotateTokensProps {
  refreshToken: string;
  refreshTokenId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/auth/login`;
  private rotateTokenUrl = `${environment.apiUrl}/refresh-token/rotate`;

  private getDecodedAccessToken( token: string ): object {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  rotateTokens(props: RotateTokensProps): Observable<ResponseDto<TokenResponse>> {
    return this.http.post<ResponseDto<TokenResponse>>(`${this.rotateTokenUrl}`, props)
    .pipe(
      tap(response => {
        const tokenInfo = this.getDecodedAccessToken(response.data!.accessToken);
        localStorage.setItem('user', JSON.stringify(tokenInfo));
        localStorage.setItem('accessToken', response.data!.accessToken);
        localStorage.setItem('refreshToken', response.data!.refreshToken);
        localStorage.setItem('refreshTokenId', response.data!.refreshTokenId);
        })
    );
  }

  login(credentials: { loginData: string, password: string }): Observable<{ data?: TokenResponse }> {
    return this.http.post<ResponseDto<TokenResponse>>(`${this.authUrl}`, credentials)
    .pipe(
      tap(response => {
        const tokenInfo = this.getDecodedAccessToken(response.data!.accessToken);
        localStorage.setItem('user', JSON.stringify(tokenInfo));
        localStorage.setItem('accessToken', response.data!.accessToken);
        localStorage.setItem('refreshToken', response.data!.refreshToken);
        localStorage.setItem('refreshTokenId', response.data!.refreshTokenId);
        })
    );
  }

  logout(): void{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenId');
    localStorage.removeItem('user');
    location.reload();
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
