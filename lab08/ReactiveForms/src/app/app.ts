import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './models/user.model';
import { UserForm } from "./user-form/user-form";

@Component({
  selector: 'app-root',
  imports: [CommonModule, UserForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ReactiveForms');
  users = signal<User[]>([]);
  editing : User | null = null;

  ngOnInit(): void {
    const raw = localStorage.getItem('users');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User[];
        this.users.set(parsed || []);
      } catch {
        this.users.set([]);
      }
    }
  }

  private persist() {
    localStorage.setItem('users', JSON.stringify(this.users()));
  }

  onSave(user: User) {
    const list = this.users();
    const idx = list.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    this.users.set(list);
    this.persist();
    this.editing = null;
  }

  onCancel() {
    this.editing = null;
  }

  editUser(id: string) {
    const u = this.users().find(x => x.id === id) || null;
    this.editing = u ? { ...u } : null;
  }

  deleteUser(id: string) {
    const filtered = this.users().filter(x => x.id !== id);
    this.users.set(filtered);
    this.persist();
  }
}
