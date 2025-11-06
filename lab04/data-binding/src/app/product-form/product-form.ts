import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlreadyExists } from "../already-exists/already-exists";

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, AlreadyExists],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  @Input() products: Array<string> = [];

  @Output() productAdded: EventEmitter<string> = new EventEmitter<string>();

  productName: string = '';

  alreadyExists(): boolean {
    return !!this.productName && this.products.includes(this.productName);
  }

  addProduct(form: NgForm): void {
    if (!this.productName || this.alreadyExists()) return;
    this.productAdded.emit(this.productName);
    this.productName = '';
    form.control.markAsUntouched();
  }
}
