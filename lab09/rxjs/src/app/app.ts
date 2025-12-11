import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomNumber } from './services/random-number';
import { Users } from './services/users';
import { take, combineLatest, map } from 'rxjs';
import { Human } from './models/human';
import { NavbarComponent } from './components/navbar-component/navbar-component/navbar-component';
import { UserFormComponent } from './components/user-form-component/user-form-component/user-form-component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NavbarComponent, UserFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rxjs');
  randomNumbers = signal<number[]>([]);
  combinedList = signal<Human[]>([]);

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
        return [...adults, ...children] as Human[];
      })
    ).subscribe((combined: Human[]) => {
      this.combinedList.set(combined);
      console.log('Połączona lista Adult + Child:', combined);
      combined.forEach(human => {
        console.log(`${human.imie} ${human.nazwisko}`);
      });
    });
  }
}
