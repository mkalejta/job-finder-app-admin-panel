import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserInitial } from '../../interface/user/UserInitials';

@Component({
  selector: 'app-user-initials',
  imports: [],
  templateUrl: './user-initials.html',
  styleUrls: ['./user-initials.scss'],
})
export class UserInitials implements OnInit, OnChanges {
  @Input() userInitials: UserInitial = { firstName: '', lastName: '', size: 40 };

  backgroundColor = '';
  initials = '';
  avatarSize = 40;

  private colors: string[] = [
    '#e74c3c',
    '#e67e22',
    '#f39c12',
    '#27ae60',
    '#16a085',
    '#2980b9',
    '#8e44ad',
    '#c0392b',
    '#d35400',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
  ];

  ngOnInit(): void {
    this.updateAvatar();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    void _changes;
    this.updateAvatar();
  }

  private updateAvatar(): void {
    if (!this.userInitials) return;

    this.avatarSize = this.userInitials.size ?? 40;
    this.initials = this.getInitials();
    this.backgroundColor = this.getRandomColor();
  }

  private getInitials(): string {
    const firstInitial = this.userInitials.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.userInitials.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}
