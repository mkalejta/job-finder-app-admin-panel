import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { pipe, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomNumber {
  public value = new BehaviorSubject<number>(0);

  newValue() {
    this.value.next(Math.floor(Math.random() * 100) + 1);
  }

  getValueObservable(): Observable<number> {
    return this.value.asObservable();
  }

  getRandomNumberEvery5Seconds(): Observable<number> {
    return interval(5000).pipe(
      map(() => Math.floor(Math.random() * 100) + 1)
    );
  }
}
