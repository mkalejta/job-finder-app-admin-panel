import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  // BehaviorSubject przechowujący dane aktualnie zalogowanego użytkownika
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
