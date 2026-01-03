import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UserInitial } from '../../interface/user/UserInitials';
import { UserInitials } from '../../shared/user-initials/user-initials';
import User from '../../interface/user/User';
import { AuthService } from '../../auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const USER_INITIALS = "userInitials";
const USERNAME = "username";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, UserInitials],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  userInitials?: UserInitial;
  user?: User;
  usernameOrInitials = signal<typeof USER_INITIALS | typeof USERNAME>(USER_INITIALS);

  ngOnInit(): void {
    this.extractUsernameOrInitials();
    
    this.authService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private extractUsernameOrInitials(): void {
    const usernameOrInitials = localStorage.getItem('usernameOrInitials');
    if (usernameOrInitials) {
      this.usernameOrInitials.set(JSON.parse(usernameOrInitials));
    }
  }

  toggleUsernameOrInitials() {
    this.usernameOrInitials.set(this.usernameOrInitials() === USER_INITIALS ? USERNAME : USER_INITIALS);
    localStorage.setItem('usernameOrInitials', JSON.stringify(this.usernameOrInitials()));
  }
}
