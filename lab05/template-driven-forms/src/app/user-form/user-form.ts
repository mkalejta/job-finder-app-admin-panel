import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../app';
import { LettersOnly } from "../directives/letters-only/letters-only";
import { FirstLetterBig } from "../directives/first-letter-big/first-letter-big";
import { NineDigits } from "../directives/nine-digits/nine-digits";
import { YearBetween } from "../directives/year-between/year-between";

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, LettersOnly, FirstLetterBig, NineDigits, YearBetween],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  @Input() users: User[] = [];
  @Output() userAdded: EventEmitter<User> = new EventEmitter<User>();
  id: number = 1;
  name: string ='';
  surname: string = '';
  phoneNumber: string = '';
  yearOfBirth?: number;
  street: string = '';
  houseNumber?: number;
  apartmentNumber?: number;
  postalCode: string = '';
  city: string ='';

  resetValues(): void {
    this.id += 1;
    this.name ='';
    this.surname = '';
    this.phoneNumber = '';
    this.yearOfBirth = undefined;
    this.street = '';
    this.houseNumber = undefined;
    this.apartmentNumber = undefined;
    this.postalCode = '';
    this.city ='';
  }

  addUser(form: NgForm): void {
    const newUser: User = {
      id: this.id,
      name: this.name,
      surname: this.surname,
      phoneNumber: this.phoneNumber,
      yearOfBirth: this.yearOfBirth,
      address: {
        street: this.street,
        houseNumber: this.houseNumber,
        apartmentNumber: this.apartmentNumber,
        postalCode: this.postalCode,
        city: this.city
      }
    };
    if (!newUser) return;
    this.userAdded.emit(newUser);
    this.resetValues();
    form.control.markAsUntouched();
  }
}
