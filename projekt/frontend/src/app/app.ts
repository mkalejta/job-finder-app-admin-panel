import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/navbar/navbar";
import { Footer } from "./core/footer/footer";
import { ToastNotification } from "./core/toast-notification/toast-notification";
import { ConfirmationModal } from "./core/confirmation-modal/confirmation-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ToastNotification, ConfirmationModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
