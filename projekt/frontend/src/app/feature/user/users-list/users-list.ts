import { Component, inject } from '@angular/core';
import { UsersService } from '../users-service.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../../../interface/user';
import { UUIDTypes } from 'uuid';


@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  users = toSignal(this.usersService.users$, { initialValue: [] });

  goToAddUser(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToUserDetails(userId: UUIDTypes): void {
    this.router.navigate([userId, 'details'], { relativeTo: this.route });
  }

  goToUserForm(user: User): void {
    this.router.navigate([user.id, 'form'], { relativeTo: this.route });
  }

  deleteUser(userId: UUIDTypes): void {
    this.usersService.deleteUser(userId);
  }
}
