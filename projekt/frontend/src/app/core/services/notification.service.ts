import { Injectable, signal } from '@angular/core';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  public readonly notifications$ = this.notifications.asReadonly();

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public show(message: string, type: NotificationType = NotificationType.INFO, duration: number = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    this.notifications.update((current) => [...current, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  public success(message: string, duration?: number): void {
    this.show(message, NotificationType.SUCCESS, duration);
  }

  public error(message: string, duration?: number): void {
    this.show(message, NotificationType.ERROR, duration);
  }

  public warning(message: string, duration?: number): void {
    this.show(message, NotificationType.WARNING, duration);
  }

  public info(message: string, duration?: number): void {
    this.show(message, NotificationType.INFO, duration);
  }

  public remove(id: string): void {
    this.notifications.update((current) => 
      current.filter((notification) => notification.id !== id)
    );
  }

  public clear(): void {
    this.notifications.set([]);
  }
}
