import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar";
import { FooterComponent } from "./core/footer/footer";
import { ToastNotificationComponent } from "./core/toast-notification/toast-notification";
import { ConfirmationModalComponent } from "./core/confirmation-modal/confirmation-modal";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastNotificationComponent, ConfirmationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly title = signal('frontend');
}
