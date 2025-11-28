import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ReactiveForms');
  users = signal<User[]>([]);
  editing : User | null = null;
}
