import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Notification, NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.scss',
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(120%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => *', [animate('250ms ease-out')]),
      transition('* => void', [animate('200ms ease-in', style({ transform: 'translateX(120%)', opacity: 0 }))])
    ])
  ]
})
export class ToastNotification {
  private notificationService = inject(NotificationService);
  protected notifications = this.notificationService.notifications$;

  protected onClose(id: string): void {
    this.notificationService.remove(id);
  }

  protected getIconClass(notification: Notification): string {
    const iconMap: Record<string, string> = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };
    return iconMap[notification.type] || 'fa-solid fa-circle-info';
  }
}
