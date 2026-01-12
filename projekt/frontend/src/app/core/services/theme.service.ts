import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DEFAULT_THEME: Theme = 'light';

  public currentTheme = signal<Theme>(this.loadTheme());

  public constructor() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  public toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  private loadTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return this.DEFAULT_THEME;
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
  }

  public getTheme(): Theme {
    return this.currentTheme();
  }
}
