import { Component, ViewChild } from '@angular/core';
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
  protected lastTime: string | null = null;
  protected lastFormat: '12' | '24' | null = null;

  @ViewChild(ClockComponent) protected clock?: ClockComponent;

  protected createClock(): void {
    this.lastTime = null;
    this.lastFormat = null;
    this.showClock = true;
  }

  protected deleteClock(): void {
    if (this.clock) {
      this.lastTime = this.clock.time;
      this.lastFormat = this.clock.format;
    }

    this.showClock = false;
  }

  protected toggleFormat(): void {
    this.format = this.format === '24' ? '12' : '24';
  }
}
