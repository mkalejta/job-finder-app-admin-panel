import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';


@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  users = toSignal(this.usersService.users$, { initialValue: [] });

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  goToAddUser(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToUserDetails(userId: UUIDTypes): void {
    this.router.navigate([userId, 'details'], { relativeTo: this.route });
  }
}
