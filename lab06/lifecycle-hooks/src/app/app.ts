import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from "./clock-component/clock-component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, ClockComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected format: '12' | '24' = '24';
  protected showClock: boolean = false;

  protected createClock(): void {
    this.showClock = true;
  }

  protected deleteClock(): void {
    this.showClock = false;
  }

  protected toggleFormat(): void {
    this.format = this.format === '24' ? '12' : '24';
  }
}
