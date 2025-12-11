import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomNumber } from './services/random-number';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rxjs');
  randomNumbers = signal<number[]>([]);

  constructor(private randomNumberService: RandomNumber) {}

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
        console.log(this.randomNumbers());
      });
  }
}
