import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-value',
  imports: [FormsModule],
  templateUrl: './value.html',
  styleUrl: './value.scss',
})
export class Value {
  @Input({required: true}) value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() test = new EventEmitter<void>();

  newValue: string = '';

  changeValue(): void {
    console.log(this.value);

    this.value = this.newValue;
    this.newValue = '';
    this.valueChange.emit(this.value);
  }

  testFunc(): void {
    this.test.emit();
  }
}
