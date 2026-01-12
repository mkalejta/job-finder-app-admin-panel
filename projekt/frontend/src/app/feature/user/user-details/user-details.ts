import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { User } from '../../../interface/user/User';
import { UsersService } from '../user.service';
import { UserInitialsComponent } from '../../../shared/user-initials/user-initials';
import { UserInitial } from '../../../interface/user/UserInitials';
import { UUIDTypes } from 'uuid';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-details',
  imports: [RouterOutlet, UserInitialsComponent, MatIconModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetailsComponent implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private confirmationService = inject(ConfirmationService);
  public user?: User;
  public users: User[] | [] = [];
  public currentIndex?: number;
  public userInitials?: UserInitial;

  public ngOnInit(): void {
    this.users = this.usersService.getUsers();
    this.route.params.subscribe((params) => {
      const id = params['id'] as UUIDTypes;
      this.user = this.users.find((user) => user.id === id);
      this.currentIndex = this.usersService.getUserIndexById(id);
      if (this.user) {
        this.userInitials = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          size: 180,
        };
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['users']);
  }

  public nextUser(): void {
    if (!this.user || this.currentIndex === undefined) {
      return;
    }
    if (this.currentIndex === this.users.length - 1) {
      return;
    }
    this.router.navigate(['users', this.users[this.currentIndex + 1].id, 'details']);
  }

  public previousUser(): void {
    if (!this.user || this.currentIndex === undefined) {
      return;
    }
    if (this.currentIndex === 0) {
      return;
    }
    this.router.navigate(['users', this.users[this.currentIndex - 1].id, 'details']);
  }

  public isFirstUser(): boolean {
    return !this.user || this.currentIndex === 0;
  }

  public isLastUser(): boolean {
    return !this.user || this.currentIndex === this.users.length - 1;
  }

  public goToUserForm(user: User): void {
    this.router.navigate([user.id, 'form'], { relativeTo: this.route.parent });
  }

  public deleteUser(userId: UUIDTypes): void {
    if (this.currentIndex === undefined) {
      return;
    }
    
    this.confirmationService.confirmDanger(
      'Delete user',
      `Are you sure you want to delete the user ${this.user?.username}? This action is irreversible.`
    ).subscribe((confirmed) => {
      if (!confirmed) return;
      
      const nextIndex = this.currentIndex! < this.users.length - 1 
        ? this.currentIndex! 
        : this.currentIndex! - 1;
      
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          if (nextIndex >= 0 && this.users.length > 1) {
            const nextUser = this.users[nextIndex === this.currentIndex ? nextIndex + 1 : nextIndex];
            this.router.navigate(['users', nextUser.id, 'details']);
          } else {
            this.router.navigate(['users']);
          }
        },
        error: () => {
          // Error already handled in service
        }
      });
    });
  }
}
