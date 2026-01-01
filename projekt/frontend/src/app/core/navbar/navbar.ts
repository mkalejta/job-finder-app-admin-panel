import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UserInitial } from '../../interface/user/user-initial';
import { UserInitials } from '../../shared/user-initials/user-initials';
import User from '../../interface/user/user';

const USER_INITIALS = "userInitials";
const USERNAME = "username";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, UserInitials],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  userInitials?: UserInitial;
  user?: User;
  usernameOrInitials = signal<typeof USER_INITIALS | typeof USERNAME>(USER_INITIALS);

  constructor() {
    this.extractUsernameOrInitials();
    this.extractUser();
  }

  private extractUsernameOrInitials(): void {
    const usernameOrInitials = JSON.parse(localStorage.getItem('usernameOrInitials')!);
    if (usernameOrInitials) {
      this.usernameOrInitials.set(usernameOrInitials);
    }
  }

  private extractUser(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.userInitials = {
        firstName: user.firstName,
        lastName: user.lastName
      };
      this.user = user;
    }
  }

  toggleUsernameOrInitials() {
    this.usernameOrInitials.set(this.usernameOrInitials() === USER_INITIALS ? USERNAME : USER_INITIALS);
    localStorage.setItem('usernameOrInitials', JSON.stringify(this.usernameOrInitials()));
  }
}
