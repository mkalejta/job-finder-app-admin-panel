import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';
import { SortPanel } from '../../../shared/sort-panel/sort-panel';
import SortingParams from '../../../interface/sorting-params';

@Component({
  selector: 'app-users-list',
  imports: [SortPanel],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  users = toSignal(this.usersService.users$, { initialValue: [] });

  sortFields = [
    { id: 'username', label: 'Username' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'phoneNumber', label: 'Phone Number' },
  ];

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  onSortChange(config: SortingParams): void {
    this.usersService.setSortParams(config);
  }

  goToAddUser(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToUserDetails(userId: UUIDTypes): void {
    this.router.navigate([userId, 'details'], { relativeTo: this.route });
  }
}
