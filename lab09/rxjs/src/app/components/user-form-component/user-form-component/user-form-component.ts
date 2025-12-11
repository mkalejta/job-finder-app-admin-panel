import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentUserService } from '../../../services/current-user-service/current-user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-form-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.scss',
})
export class UserFormComponent {
  imie: string = '';
  nazwisko: string = '';
  email: string = '';

  constructor(private currentUserService: CurrentUserService) {}

  onSubmit(): void {
    const user: User = {
      imie: this.imie,
      nazwisko: this.nazwisko,
      email: this.email
    };

    this.currentUserService.setCurrentUser(user);
    console.log('UserFormComponent - Zapisano użytkownika:', user);
  }
}
