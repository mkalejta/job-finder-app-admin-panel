import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ConfirmationType {
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  requireTextConfirmation?: boolean;
  confirmationText?: string;
}

interface ConfirmationDialogData extends ConfirmationConfig {
  id: string;
  subject: Subject<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private currentDialog = signal<ConfirmationDialogData | null>(null);
  public readonly currentDialog$ = this.currentDialog.asReadonly();

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public confirm(config: ConfirmationConfig): Observable<boolean> {
    const subject = new Subject<boolean>();
    
    const dialogData: ConfirmationDialogData = {
      id: this.generateId(),
      title: config.title,
      message: config.message,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      type: config.type || ConfirmationType.WARNING,
      requireTextConfirmation: config.requireTextConfirmation || false,
      confirmationText: config.confirmationText,
      subject
    };

    this.currentDialog.set(dialogData);

    return subject.asObservable();
  }

  public confirmDanger(title: string, message: string, requireText: boolean = false): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: ConfirmationType.DANGER,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      requireTextConfirmation: requireText,
      confirmationText: requireText ? 'DELETE' : undefined
    });
  }

  public confirmWarning(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: ConfirmationType.WARNING,
      confirmText: 'Continue',
      cancelText: 'Cancel'
    });
  }

  public confirmInfo(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      type: ConfirmationType.INFO,
      confirmText: 'OK',
      cancelText: 'Cancel'
    });
  }

  public handleConfirm(): void {
    const dialog = this.currentDialog();
    if (dialog) {
      dialog.subject.next(true);
      dialog.subject.complete();
      this.currentDialog.set(null);
    }
  }

  public handleCancel(): void {
    const dialog = this.currentDialog();
    if (dialog) {
      dialog.subject.next(false);
      dialog.subject.complete();
      this.currentDialog.set(null);
    }
  }

  public close(): void {
    this.handleCancel();
  }
}
