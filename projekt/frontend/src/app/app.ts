import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/navbar/navbar";
import { Footer } from "./core/footer/footer";
import { ToastNotification } from "./core/toast-notification/toast-notification";
import { ConfirmationModal } from "./core/confirmation-modal/confirmation-modal";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ToastNotification, ConfirmationModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private themeService = inject(ThemeService);
  protected readonly title = signal('frontend');
}
