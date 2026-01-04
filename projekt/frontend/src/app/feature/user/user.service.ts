import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import User from '../../interface/user/User';
import ResponseDto from '../../interface/ResponseDto';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import UserCreateDto from '../../interface/user/UserCreateDto';
import UserUpdateDto from '../../interface/user/UserUpdateDto';
import SortingParams from '../../interface/SortingParams';
import PaginationParams from '../../interface/PaginationParams';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { FilteringParams } from '../../interface/FilteringParams';
import { NotificationService } from '../../core/services/notification.service';

export interface UserFilters {
  [key: string]: unknown;
  username?: string;
  email?: string;
  firstDate?: string;
  lastDate?: string;
}
export type UserFilteringParams = FilteringParams<UserFilters>;

@Injectable({
  providedIn: 'root',
})
export class UsersService{
  private http = inject(HttpClient);
  private paginationService = inject(PaginationService);
  private notificationService = inject(NotificationService);
  private users = new BehaviorSubject<User[]>([]);
  private userUrl = environment.apiUrl + '/admin/user';
  private sortParams = new BehaviorSubject<SortingParams>({});
  private filteringParams = new BehaviorSubject<UserFilteringParams>({ filters: {} });
  users$: Observable<User[] | []> = this.users.asObservable();

  constructor() {
    combineLatest([
      this.sortParams.asObservable(),
      this.paginationService.pagination$,
      this.filteringParams.asObservable()
    ]).subscribe(([sort, pagination, filtering]) => {
      this.fetchUsers(sort, pagination, filtering).subscribe();
    });
  }

  private fetchUsers(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: UserFilteringParams): Observable<User[]> {
    const sortField = sortParams?.sort || 'createdAt';
    const sortDirection = (sortParams?.direction || 'DESC').toUpperCase();
    const page = paginationParams?.page;
    const size = paginationParams?.size;
    const filters = filteringParams?.filters || {};

    const httpParams = {
      ...filters,
      page: page.toString(),
      size: size.toString(),
      sort: `${sortField},${sortDirection.toLowerCase()}`
    };

    return this.http.get<ResponseDto<{ content: User[] }>>(this.userUrl, { params: httpParams }).pipe(
      map((response) => response.data?.content),
      tap((data) => this.setUsers(data)),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Failed to fetch the list of users');
        return of(this.users.value);
      })
    );
  }

  private createUserRequest(user: UserCreateDto): Observable<User> {
    return this.http.post<ResponseDto<User>>(this.userUrl, user).pipe(
      map((response) => response.data),
      tap((newUser) => {
        if (newUser) {
          this.notificationService.success('User has been created successfully');
          this.loadUsers();
        }
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Failed to create the user');
        return of(err.error);
      })
    );
  }

  private updateUserRequest(user: UserUpdateDto, userId: UUIDTypes): Observable<User> {
    return this.http.put<ResponseDto<User>>(`${this.userUrl}/${userId}`, user).pipe(
      map((response) => response.data),
      tap((updatedUser) => {
        if (updatedUser) {
          this.notificationService.success('User has been updated successfully');
          this.loadUsers();
        }
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Failed to update the user');
        return of(err.error);
      })
    );
  }

  private deleteUserRequest(userId: UUIDTypes): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.userUrl}/${userId}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('User has been deleted successfully');
        this.loadUsers();
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Failed to delete the user');
        return of(err.error);
      })
    );
  }
    
  loadUsers(sortParams?: SortingParams, filteringParams?: UserFilteringParams): void {
    if (sortParams) {
      this.sortParams.next(sortParams);
    }
    if (filteringParams) {
      this.filteringParams.next(filteringParams);
    }
  }

  setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
  }

  setFilteringParams(params: UserFilteringParams): void {
    this.filteringParams.next(params);
  }

  setUsers(users: User[]): void {
    if (!users) return;
    this.users.next(users);
  }

  getUsers(): User[] {
    return this.users.value;
  }

  createUser(user: UserCreateDto): Observable<User> {
    return this.createUserRequest(user);
  }

  updateUser(updatedUser: UserUpdateDto, userId: UUIDTypes): Observable<User> {
    return this.updateUserRequest(updatedUser, userId);
  }

  deleteUser(userId: UUIDTypes): Observable<void> {
    return this.deleteUserRequest(userId);
  }

  generateId(): UUIDTypes {
    return uuidv4();
  }

  getUserIndexById(userId: UUIDTypes): number {
    const currentUsers = this.users.value;
    return currentUsers.findIndex(user => user.id === userId);
  }
}