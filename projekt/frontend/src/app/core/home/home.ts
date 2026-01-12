import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  public isAuth = !!this.authService.getToken();
  public user = this.authService.getUserData();

  public goToLoginForm(): void {
    this.router.navigate(['/login']);
  }

  public logout(): void {
    this.authService.logout();
  }
}
