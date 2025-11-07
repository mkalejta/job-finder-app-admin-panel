import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../app';

@Component({
  selector: 'app-user-list',
  imports: [],
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
