import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock-component',
  imports: [CommonModule],
  templateUrl: './clock-component.html',
  styleUrl: './clock-component.scss',
})
export class ClockComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) public format!: '12' | '24';

  public time: string = '';
  private intervalId: any = null;

  ngOnInit(): void {
    this.updateTime();
    this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['format']) {
      this.updateTime();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  public start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  public stop(): void {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private updateTime(): void {
    const now = new Date();
    if (this.format === '12') {
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}:${seconds} ${ampm}`;
    } else {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}:${seconds}`;
    }
  }
}
