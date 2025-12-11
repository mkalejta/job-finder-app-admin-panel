import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Adult } from '../models/adult';
import { Child } from '../models/child';

const ADULTS: Adult[] = [
  { id: 1, imie: 'Michał', nazwisko: 'Kaczmarek' },
  { id: 2, imie: 'Anna', nazwisko: 'Kowalska' },
  { id: 3, imie: 'Alicja', nazwisko: 'Nowak' },
  { id: 4, imie: 'Justyna', nazwisko: 'Ostrowska' },
  { id: 5, imie: 'Robert', nazwisko: 'Sikora' },
];

const CHILDREN: Child[] = [
  { id: 101, imie: 'Jan', nazwisko: 'Kaczmarek' },
  { id: 102, imie: 'Maria', nazwisko: 'Kowalska' },
  { id: 103, imie: 'Piotr', nazwisko: 'Nowak' },
  { id: 104, imie: 'Katarzyna', nazwisko: 'Ostrowska' },
  { id: 105, imie: 'Tomasz', nazwisko: 'Sikora' },
];

@Injectable({
  providedIn: 'root',
})
export class Users {
  
  getAdults(): Observable<Adult[]> {
    const randomCount = Math.floor(Math.random() * ADULTS.length) + 1;
    const randomAdults = ADULTS.slice(0, randomCount);
    const randomDelay = Math.floor(Math.random() * 3000);
    return of(randomAdults).pipe(delay(randomDelay));
  }

  getChildren(): Observable<Child[]> {
    const randomCount = Math.floor(Math.random() * CHILDREN.length) + 1;
    const randomChildren = CHILDREN.slice(0, randomCount);
    const randomDelay = Math.floor(Math.random() * 3000);
    return of(randomChildren).pipe(delay(randomDelay));
  }

  getUser(): Observable<Adult[]> {
    return this.getAdults();
  }

  getChild(): Observable<Child[]> {
    return this.getChildren();
  }
}
