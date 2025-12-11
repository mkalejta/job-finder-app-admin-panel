import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';

export interface AlertMessage {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  // BehaviorSubject przechowujący dane aktualnie zalogowanego użytkownika
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // BehaviorSubject dla komunikatów alertów
  private alertMessageSubject = new BehaviorSubject<AlertMessage | null>(null);
  alertMessage$: Observable<AlertMessage | null> = this.alertMessageSubject.asObservable();

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  showAlert(message: string): void {
    this.alertMessageSubject.next({ message });
  }

  clearAlert(): void {
    this.alertMessageSubject.next(null);
  }
}
