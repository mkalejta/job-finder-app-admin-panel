import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { UsersService, UserFilteringParams } from '../user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';
import { SortPanel } from '../../../shared/sort-panel/sort-panel';
import { FilterPanel } from '../../../shared/filter-panel/filter-panel';
import { FilterField } from '../../../interface/FilterField';
import SortingParams from '../../../interface/SortingParams';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [SortPanel, FilterPanel, CommonModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private paginationService = inject(PaginationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  users = toSignal(this.usersService.users$, { initialValue: [] });
  pagination = toSignal(this.paginationService.pagination$, {
    initialValue: { page: 0, size: 20 }
  });

  pageSizeOptions = [20, 10, 5];

  sortFields = [
    { id: 'username', label: 'Username' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'phoneNumber', label: 'Phone Number' },
  ];

  filterFields: FilterField[] = [
    {
      id: 'username',
      label: 'Username',
      type: 'text',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      id: 'firstDate',
      label: 'Created After',
      type: 'date',
    },
    {
      id: 'lastDate',
      label: 'Created Before',
      type: 'date',
    }
  ];

  filteringParams: UserFilteringParams = {
    filters: {
      username: '',
      email: '',
      firstDate: '',
      lastDate: '',
    },
  };

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortChange(config: SortingParams): void {
    this.usersService.setSortParams(config);
  }

  onFilterChange(params: UserFilteringParams): void {
    this.filteringParams = params;
    this.usersService.setFilteringParams(params);
  }

  onPageSizeChange(size: number): void {
    this.paginationService.setPageSize(size);
  }

  onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  goToAddUser(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToUserDetails(userId: UUIDTypes): void {
    this.router.navigate([userId, 'details'], { relativeTo: this.route });
  }
}
