import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import User from '../../../interface/user/User';
import { UsersService } from '../user.service';
import { UserInitials } from '../../../shared/user-initials/user-initials';
import { UserInitial } from '../../../interface/user/UserInitials';
import { UUIDTypes } from 'uuid';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-user-details',
  imports: [RouterOutlet, UserInitials],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private confirmationService = inject(ConfirmationService);
  user?: User;
  users: User[] | [] = [];
  currentIndex?: number;
  userInitials?: UserInitial;

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
    this.route.params.subscribe((params) => {
      const id = params['id'];
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

  goBack(): void {
    this.router.navigate(['users']);
  }

  nextUser(): void {
    if (!this.user || this.currentIndex === undefined) return;
    if (this.currentIndex === this.users.length - 1) return;
    this.router.navigate(['users', this.users[this.currentIndex + 1].id, 'details']);
  }

  previousUser(): void {
    if (!this.user || this.currentIndex === undefined) return;
    if (this.currentIndex === 0) return;
    this.router.navigate(['users', this.users[this.currentIndex - 1].id, 'details']);
  }

  isFirstUser(): boolean {
    return !this.user || this.currentIndex === 0;
  }

  isLastUser(): boolean {
    return !this.user || this.currentIndex === this.users.length - 1;
  }

  goToUserForm(user: User): void {
    this.router.navigate([user.id, 'form'], { relativeTo: this.route.parent });
  }

  deleteUser(userId: UUIDTypes): void {
    if (this.currentIndex === undefined) return;
    
    this.confirmationService.confirmDanger(
      'Delete user',
      `Are you sure you want to delete the user ${this.user?.username}? This action is irreversible.`
    ).subscribe(confirmed => {
      if (!confirmed) return;
      
      const nextIndex = this.currentIndex! < this.users.length - 1 
        ? this.currentIndex! 
        : this.currentIndex! - 1;
      
      this.usersService.deleteUser(userId);
      
      if (nextIndex >= 0 && this.users.length > 1) {
        const nextUser = this.users[nextIndex === this.currentIndex ? nextIndex + 1 : nextIndex];
        this.router.navigate(['users', nextUser.id, 'details']);
      } else {
        this.router.navigate(['users']);
      }
    });
  }
}
