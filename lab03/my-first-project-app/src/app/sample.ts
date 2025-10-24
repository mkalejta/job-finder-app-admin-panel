import { Component } from "@angular/core";

// Przykładowy komponent - selector zaczyna się od 'mk' (Twoje inicjały)
@Component({
  selector: "mk-sample",
  template: `<div>{{ getCount() }}</div>`
})
export class MkSampleComponent {
  // jawne modyfikatory dostępu i jawne typy
  public count = 0;
  public readonly CONSTANT_VALUE: number = 42;

  // konstruktor pozostawiony bez dodatknych modifierów na poziomie konstrukcji
  constructor() {}

  // jawnie zadeklarowany typ zwracany
  public increment(amount: number): number {
    this.count += amount;
    return this.count;
  }

  public getCount(): number {
    return this.count;
  }
}

// Przykładowe funkcje poza klasą z jawnie zadeklarowanymi typami
export function add(a: number, b: number): number {
  return a + b;
}

// Preferuj const dla stałych referencyjnych
const numbers: number[] = [1, 2, 3];
numbers.push(4); // modyfikacja zawartości jest OK, zmienna pozostaje const

// Używaj let dla zmiennych, które będą reasignowane
let mutableValue = 10;
mutableValue = 20;