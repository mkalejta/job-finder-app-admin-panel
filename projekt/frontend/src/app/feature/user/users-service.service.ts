import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import User from '../../interface/user';
import { users } from '../../../data/users';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users = new BehaviorSubject<User[] | []>(users);
  users$: Observable<User[] | []> = this.users.asObservable();

  setUsers(users: User[] | []): void {
    this.users.next(users);
  }

  getUsers(): User[] | [] {
    return this.users.value;
  }

  addUser(user: User): void {
    const currentUsers = this.users.value;
    this.users.next([...currentUsers, user]);
  }

  updateUser(updatedUser: User): void {
    const currentUsers = this.users.value;
    const index = currentUsers.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[index] = updatedUser;
      this.users.next(updatedUsers);
    }
  }

  deleteUser(userId: UUIDTypes): void {
    const currentUsers = this.users.value;
    const filteredUsers = currentUsers.filter(user => user.id !== userId);
    this.users.next(filteredUsers);
  }

  generateId(): UUIDTypes {
    return uuidv4();
  }

  getUserIndexById(userId: UUIDTypes): number {
    const currentUsers = this.users.value;
    return currentUsers.findIndex(user => user.id === userId);
  }
}