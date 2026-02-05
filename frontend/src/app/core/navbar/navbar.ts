import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UserInitial } from '../../interface/user/UserInitials';
import { UserInitialsComponent } from '../../shared/user-initials/user-initials';
import { User } from '../../interface/user/User';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../services/theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

const USER_INITIALS = "userInitials";
const USERNAME = "username";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, UserInitialsComponent, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  private destroy$ = new Subject<void>();

  public userInitials?: UserInitial;
  public user?: User;
  public usernameOrInitials = signal<'userInitials' | 'username'>(USER_INITIALS);

  public ngOnInit(): void {
    this.extractUsernameOrInitials();
    
    this.authService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (user) {
          this.user = user;
          this.userInitials = {
            firstName: user.firstName,
            lastName: user.lastName
          };
        } else {
          this.user = undefined;
          this.userInitials = undefined;
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private extractUsernameOrInitials(): void {
    const usernameOrInitials = localStorage.getItem('usernameOrInitials');
    if (usernameOrInitials) {
      this.usernameOrInitials.set(JSON.parse(usernameOrInitials) as 'userInitials' | 'username');
    }
  }

  public toggleUsernameOrInitials(): void {
    this.usernameOrInitials.set(this.usernameOrInitials() === USER_INITIALS ? USERNAME : USER_INITIALS);
    localStorage.setItem('usernameOrInitials', JSON.stringify(this.usernameOrInitials()));
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
