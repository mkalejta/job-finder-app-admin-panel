import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Address } from '../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-part',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-part.html',
  styleUrl: './address-part.scss',
})
export class AddressPart {
  @Input() group!: FormGroup;
  @Input() address: Address | null = null;
  @Output() remove = new EventEmitter<void>();

  onRemove() {
    this.remove.emit();
  }
}
