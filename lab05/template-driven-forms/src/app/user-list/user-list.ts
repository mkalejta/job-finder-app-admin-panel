import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../app';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  @Input() users: User[] = [];
  @Output() userDeleted: EventEmitter<number> = new EventEmitter<number>();

  deleteUser(id: number): void {
    this.userDeleted.emit(id);
  }
}
