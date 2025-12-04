import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, Address } from '../models/user.model';
import { AddressPart } from '../address-part/address-part';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, AddressPart],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit, OnChanges {
  @Input() editing: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      addresses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.applyEditing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing']) {
      this.applyEditing();
    }
  }

  private applyEditing() {
    if (this.editing) {
      this.userForm.patchValue({
        name: this.editing.name,
        surname: this.editing.surname,
        email: this.editing.email
      });

      this.addresses.clear();
      if (this.editing.address && Array.isArray(this.editing.address)) {
        for (const addr of this.editing.address) {
          this.addAddress(addr);
        }
      }
    } else {
      this.userForm.reset();
      this.addresses.clear();
    }
  }

  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  getAddressGroup(index: number) {
    return this.addresses.at(index) as FormGroup;
  }

  private createAddressGroup(addr?: Address): FormGroup {
    return this.fb.group({
      street: [addr?.street || '', [Validators.required]],
      city: [addr?.city || '', [Validators.required]],
      postalCode: [addr?.postalCode || '', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  addAddress(addr?: Address) {
    this.addresses.push(this.createAddressGroup(addr));
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  submitForm() {
    if (this.userForm.invalid) return;
    const value = this.userForm.value;
    const user: User = {
      id: this.editing?.id || this.generateId(),
      name: value.name,
      surname: value.surname,
      email: value.email,
      address: value.addresses || []
    };
    this.save.emit(user);
  }

  onCancel() {
    this.cancel.emit();
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
