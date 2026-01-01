import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import User from '../../interface/user/user';
import ResponseDto from '../../interface/response-dto';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import UserCreateDto from '../../interface/user/UserCreateDto';
import UserUpdateDto from '../../interface/user/UserUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class UsersService{
  private http = inject(HttpClient);
  private users = new BehaviorSubject<User[]>(this.readStorage());
  private userUrl = environment.apiUrl + '/admin/user';
  users$: Observable<User[] | []> = this.users.asObservable();

  private readStorage(): User[] | [] {
    try {
      const raw = localStorage.getItem('users');
      if (!raw) return [];
      const data = JSON.parse(raw) as User[];
      return data;
    } catch (e){
      console.error('Failed to read users from storage', e);
      return [];
    }
  }

  private writeStorage(users: User[]): void {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to write users to storage', e);
    }
  }

  private fetchUsers(): Observable<User[]> {
    return this.http.get<ResponseDto<{ content: User[] }>>(this.userUrl).pipe(
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
    
  loadUsers(): void {
    this.fetchUsers().subscribe();
  }

  setUsers(users: User[]): void {
    if (!users) return;
    this.users.next(users);
    this.writeStorage(users);
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