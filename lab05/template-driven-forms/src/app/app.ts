import { Component } from '@angular/core';
import { UserForm } from "./user-form/user-form";
import { UserList } from "./user-list/user-list";

export interface Address {
  street: string;
  houseNumber?: number;
  apartmentNumber?: number;
  postalCode: string;
  city: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  yearOfBirth?: number;
  address: Address;
}

@Component({
  selector: 'app-root',
  imports: [UserForm, UserList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected users: User[] = [];

  protected addUser(user: User) {
    this.users = [...this.users, user];
  }

  protected deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
  }
}
