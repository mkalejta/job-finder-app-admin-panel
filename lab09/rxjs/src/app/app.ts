import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomNumber } from './services/random-number';
import { Users } from './services/users';
import { take, combineLatest, map } from 'rxjs';
import { Adult } from './models/adult';
import { Child } from './models/child';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rxjs');
  randomNumbers = signal<number[]>([]);
  combinedList = signal<User[]>([]);

  constructor(
    private randomNumberService: RandomNumber,
    private usersService: Users) {}

  ngOnInit(): void {
    this.randomNumberService.getRandomNumberEvery5Seconds()
      .pipe(take(5))
      .subscribe((value: number) => {
        const current = this.randomNumbers();
        const updatedArray = [...current, value];
        this.randomNumbers.set(updatedArray);
        console.log('Wylosowana liczba:', value);
      })
      .add(() => {
        console.log('Pierwsze 5 wartości:', this.randomNumbers());
      });

    combineLatest([
      this.usersService.getAdults(),
      this.usersService.getChildren()
    ]).pipe(
      map(([adults, children]) => {
        return [...adults, ...children] as User[];
      })
    ).subscribe((combined: User[]) => {
      this.combinedList.set(combined);
      console.log('Połączona lista Adult + Child:', combined);
      combined.forEach(user => {
        console.log(`${user.imie} ${user.nazwisko}`);
      });
    });
  }
}
