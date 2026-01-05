import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import TokenResponse from '../interface/TokenResponse';
import ResponseDto from '../interface/ResponseDto';
import { JwtHelperService } from '@auth0/angular-jwt';
import User from '../interface/user/User';
import { JwtPayload } from '../interface/JwtPayload';
import { NotificationService } from '../core/services/notification.service';

export interface RotateTokensProps {
  refreshToken: string;
  refreshTokenId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authUrl = `${environment.apiUrl}/auth/login`;
  private rotateTokenUrl = `${environment.apiUrl}/refresh-token/rotate`;
  private userDataSubject = new BehaviorSubject<User | null>(this.getUserData());
  public userData$ = this.userDataSubject.asObservable();

  private getDecodedAccessToken(token: string): JwtPayload {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  private extractInfoFromToken(response: ResponseDto<TokenResponse>): void {
    const jwtPayload = this.getDecodedAccessToken(response.data!.accessToken);

    if (jwtPayload.role !== 'ADMIN') {
      this.notificationService.warning('Wymagana rola ADMIN');
      throw new Error('FORBIDDEN_ROLE');
    }
    
    const userData: Partial<User> = {
      id: jwtPayload.sub,
      username: jwtPayload.username,
      email: jwtPayload.email,
      role: jwtPayload.role,
      firstName: jwtPayload.firstName,
      lastName: jwtPayload.lastName,
      phoneNumber: jwtPayload.phoneNumber,
      profileDescription: jwtPayload.profileDescription,
      profilePhoto: jwtPayload.profilePhoto,
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', response.data!.accessToken);
    localStorage.setItem('refreshToken', response.data!.refreshToken);
    localStorage.setItem('refreshTokenId', response.data!.refreshTokenId);
    this.userDataSubject.next(userData as User);
  }

  private removeInfoFromStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenId');
    localStorage.removeItem('user');
    this.userDataSubject.next(null);
  }

  rotateTokens(props: RotateTokensProps): Observable<ResponseDto<TokenResponse>> {
    return this.http.post<ResponseDto<TokenResponse>>(`${this.rotateTokenUrl}`, props)
    .pipe(tap(response => this.extractInfoFromToken(response)));
  }

  login(credentials: { loginData: string, password: string }): Observable<{ data?: TokenResponse }> {
    return this.http.post<ResponseDto<TokenResponse>>(`${this.authUrl}`, credentials)
    .pipe(tap(response => this.extractInfoFromToken(response)));
  }

  logout(): void{
    this.removeInfoFromStorage();
    location.reload();
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getUserData();
    if (!user) return false;
    return user.role === role;
  }
}
