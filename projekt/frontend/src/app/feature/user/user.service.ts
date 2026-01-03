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

export interface UserFilters {
  [key: string]: unknown;
  username?: string;
}
export type UserFilteringParams = FilteringParams<UserFilters>;

@Injectable({
  providedIn: 'root',
})
export class UsersService{
  private http = inject(HttpClient);
  private paginationService = inject(PaginationService);
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
      ...(filters.username && typeof filters.username === 'string' && filters.username.trim() !== '' ? { username: filters.username.trim() } : {}),
      page: page.toString(),
      size: size.toString(),
      sort: `${sortField},${sortDirection.toLowerCase()}`
    };

    return this.http.get<ResponseDto<{ content: User[] }>>(this.userUrl, { params: httpParams }).pipe(
      map((response) => response.data?.content),
      tap((data) => this.setUsers(data)),
      catchError((err) => {
        console.error('Error fetching users:', err);
        return of(this.users.value);
      })
    );
  }

  private createUserRequest(user: UserCreateDto): Observable<User> {
    return this.http.post<ResponseDto<User>>(this.userUrl, user).pipe(
      map((response) => response.data),
      tap((newUser) => {
        if (newUser) {
          this.loadUsers();
        }
      }),
      catchError((err) => {
        console.error('Error adding user:', err);
        return of(err.error);
      })
    );
  }

  private updateUserRequest(user: UserUpdateDto, userId: UUIDTypes): Observable<User> {
    return this.http.put<ResponseDto<User>>(`${this.userUrl}/${userId}`, user).pipe(
      map((response) => response.data),
      tap((updatedUser) => {
        if (updatedUser) {
          this.loadUsers();
        }
      }),
      catchError((err) => {
        console.error('Error updating user:', err);
        return of(err.error);
      })
    );
  }

  private deleteUserRequest(userId: UUIDTypes): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.userUrl}/${userId}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.loadUsers();
      }),
      catchError((err) => {
        console.error('Error deleting user:', err);
        return of(err.error);
      })
    );
  }
    
  loadUsers(sortParams?: SortingParams): void {
    if (sortParams) {
      this.sortParams.next(sortParams);
    }
  }

  setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
    this.loadUsers(params);
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

  createUser(user: UserCreateDto): void {
    this.createUserRequest(user).subscribe();
  }

  updateUser(updatedUser: UserUpdateDto, userId: UUIDTypes): void {
    this.updateUserRequest(updatedUser, userId).subscribe();
  }

  deleteUser(userId: UUIDTypes): void {
    this.deleteUserRequest(userId).subscribe();
  }

  generateId(): UUIDTypes {
    return uuidv4();
  }

  getUserIndexById(userId: UUIDTypes): number {
    const currentUsers = this.users.value;
    return currentUsers.findIndex(user => user.id === userId);
  }
}