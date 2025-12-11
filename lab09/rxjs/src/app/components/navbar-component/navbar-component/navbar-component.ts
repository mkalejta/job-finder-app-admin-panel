import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../../../services/current-user-service/current-user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar-component',
  imports: [CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent implements OnInit {
  currentUser = signal<User | null>(null);

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe((user: User | null) => {
      this.currentUser.set(user);
    });
  }
}
