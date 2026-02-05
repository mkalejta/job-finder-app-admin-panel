import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { UsersService, UserFilteringParams } from '../user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';
import { SortPanelComponent } from '../../../shared/sort-panel/sort-panel';
import { FilterPanelComponent } from '../../../shared/filter-panel/filter-panel';
import { FilterField } from '../../../interface/FilterField';
import { SortingParams } from '../../../interface/SortingParams';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [SortPanelComponent, FilterPanelComponent, CommonModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private paginationService = inject(PaginationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  public users = toSignal(this.usersService.users$, { initialValue: [] });
  public pageInfo = toSignal(this.usersService.pageInfo$, {
    initialValue: { first: true, last: true, totalPages: 0 }
  });
  public pagination = toSignal(this.paginationService.pagination$, {
    initialValue: { page: 0, size: 20 }
  });

  public pageSizeOptions = [20, 10, 5];

  public sortFields = [
    { id: 'username', label: 'Username' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'phoneNumber', label: 'Phone Number' },
  ];

  public filterFields: FilterField[] = [
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

  public filteringParams: UserFilteringParams = {
    filters: {
      username: '',
      email: '',
      firstDate: '',
      lastDate: '',
    },
  };

  public ngOnInit(): void {
    this.paginationService.reset();
    this.usersService.loadUsers();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSortChange(config: SortingParams): void {
    this.usersService.setSortParams(config);
  }

  public onFilterChange(params: UserFilteringParams): void {
    this.filteringParams = params;
    this.usersService.setFilteringParams(params);
  }

  public onPageSizeChange(size: number): void {
    this.paginationService.setPageSize(size);
  }

  public onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  public goToAddUser(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  public goToUserDetails(userId: UUIDTypes): void {
    this.router.navigate([userId, 'details'], { relativeTo: this.route });
  }
}
