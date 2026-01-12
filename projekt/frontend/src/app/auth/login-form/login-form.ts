import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

interface LoginFormGroup {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  public loginForm!: FormGroup<LoginFormGroup>;

  public ngOnInit(): void {
    this.loginForm = this.fb.group<LoginFormGroup>({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notificationService.warning('Please fill in the form correctly.');

      return;
    }

    const formValue = this.loginForm.value;

    this.authService.login({ loginData: String(formValue.username), password: String(formValue.password) }).subscribe({
      next: () => {
        this.notificationService.success('Successfully logged in');
        this.router.navigate(['/']);
      },
      error: (err: Error) => {
        if (err instanceof Error && err.message === 'FORBIDDEN_ROLE') {
          return;
        }
        this.notificationService.error('Invalid login credentials');
      }
    });
  }

  public get username(): FormControl<string | null> {
    return this.loginForm.controls.username;
  }

  public get password(): FormControl<string | null> {
    return this.loginForm.controls.password;
  }
}
