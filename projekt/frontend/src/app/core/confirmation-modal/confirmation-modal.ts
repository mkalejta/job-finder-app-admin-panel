import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, ConfirmationType } from '../services/confirmation.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {
  private confirmationService = inject(ConfirmationService);
  protected dialog = this.confirmationService.currentDialog$;
  protected userInput = signal('');
  protected canConfirm = signal(false);

  protected readonly ConfirmationType = ConfirmationType;

  constructor() {
    effect(() => {
      const currentDialog = this.dialog();
      if (currentDialog?.requireTextConfirmation && currentDialog.confirmationText) {
        const isValid = this.userInput().toUpperCase() === currentDialog.confirmationText.toUpperCase();
        this.canConfirm.set(isValid);
      } else {
        this.canConfirm.set(true);
      }
    });
  }

  protected onConfirm(): void {
    if (this.canConfirm()) {
      this.confirmationService.handleConfirm();
      this.resetInput();
    }
  }

  protected onCancel(): void {
    this.confirmationService.handleCancel();
    this.resetInput();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  protected onInputChange(value: string): void {
    this.userInput.set(value);
  }

  private resetInput(): void {
    this.userInput.set('');
  }

  protected getIconClass(): string {
    const dialog = this.dialog();
    if (!dialog) return 'info';
    
    const iconMap: Record<ConfirmationType, string> = {
      [ConfirmationType.DANGER]: 'warning',
      [ConfirmationType.WARNING]: 'error',
      [ConfirmationType.INFO]: 'info'
    };
    return iconMap[dialog.type || ConfirmationType.INFO];
  }
}
