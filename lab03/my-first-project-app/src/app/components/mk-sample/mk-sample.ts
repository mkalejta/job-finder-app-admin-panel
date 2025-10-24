import { Component } from '@angular/core';

@Component({
  selector: 'mk-mk-sample',
  imports: [],
  templateUrl: './mk-sample.html',
  styleUrl: './mk-sample.scss',
})
export class MkSample {
public title = 'mk sample';

  constructor() {}

  /* jawny typ zwracany i modyfikator dostępu */
  public getTitle(): string {
    return this.title;
  }

  /* prywatna metoda również z modyfikatorem i typem zwracanym */
  private computeValue(): number {
    const value = 42;
    return value;
  }
}