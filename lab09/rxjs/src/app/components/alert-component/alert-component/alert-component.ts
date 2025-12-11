import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentUserService, AlertMessage } from '../../../services/current-user-service/current-user-service';

@Component({
  selector: 'app-alert-component',
  imports: [CommonModule],
  templateUrl: './alert-component.html',
  styleUrl: './alert-component.scss',
})
export class AlertComponent implements OnInit, OnDestroy {
  alertMessage = signal<AlertMessage | null>(null);
  private timeoutId: any = null;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.currentUserService.alertMessage$.subscribe((message: AlertMessage | null) => {
      this.alertMessage.set(message);
      
      if (message) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        
        this.timeoutId = setTimeout(() => {
          this.currentUserService.clearAlert();
        }, 5000);        
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  closeAlert(): void {
    this.currentUserService.clearAlert();
  }
}
