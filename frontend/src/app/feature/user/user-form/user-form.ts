import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user/User';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';
import { Location } from '@angular/common';
import { UUIDTypes } from 'uuid';
import { UserCreateDto } from '../../../interface/user/UserCreateDto';
import { UserUpdateDto } from '../../../interface/user/UserUpdateDto';
import { passwordValidator } from '../../../shared/validators/password.validator';
import { usernameValidator } from '../../../shared/validators/username.validator';
import { emailValidator } from '../../../shared/validators/email.validator';
import { phoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { NotificationService } from '../../../core/services/notification.service';
import { profileInfoValidator } from '../../../shared/validators/profile-info.validator';
import { MatIconModule } from '@angular/material/icon';

interface UserFormGroup {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  password: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  profileDescription: FormControl<string | null>;
}

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private usersService = inject(UsersService);
  private notificationService = inject(NotificationService);
  public userForm!: FormGroup<UserFormGroup>;
  public user?: User;
  public isEditMode = false;
  public userId?: UUIDTypes;

  public ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      const id = params['id'] as UUIDTypes;
      if (id) {
        this.isEditMode = true;
        this.userId = id;
        const users = this.usersService.getUsers();
        this.user = users.find((user) => user.id === id);
        
        this.initForm();

        if (this.user) {
          this.userForm.patchValue({
            username: this.user.username,
            email: this.user.email,
            phoneNumber: String(this.user.phoneNumber),
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            profileDescription: this.user.profileDescription,
          });
        }
      }
    });
  }

  public initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, usernameValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      password: ['', this.isEditMode ? [] : [Validators.required, passwordValidator()]],
      firstName: ['', [Validators.required, profileInfoValidator()]],
      lastName: ['', [Validators.required, profileInfoValidator()]],
      profileDescription: ['', [Validators.maxLength(500), profileInfoValidator()]],
    });
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');

      return;
    }

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId && this.user) {
      const updatedUser: UserUpdateDto = {
        username: formValue.username!,
        email: formValue.email!,
        phoneNumber: formValue.phoneNumber!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        profileDescription: formValue.profileDescription!
      };
      this.usersService.updateUser(updatedUser, this.userId).subscribe({
        next: () => {
          this.router.navigate(['users']);
        },
        error: () => {
          // Error already handled in service
        }
      });
    } else {
      const newUser: UserCreateDto = {
        username: formValue.username!,
        email: formValue.email!,
        phoneNumber: formValue.phoneNumber!,
        password: formValue.password!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        profileDescription: formValue.profileDescription!
      };
      this.usersService.createUser(newUser).subscribe({
        next: () => {
          this.router.navigate(['users']);
        },
        error: () => {
          // Error already handled in service
        }
      });
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public get username(): FormControl<string | null> {
    return this.userForm.get('username') as FormControl<string | null>;
  }

  public get email(): FormControl<string | null> {
    return this.userForm.get('email') as FormControl<string | null>;
  }
  
  public get phoneNumber(): FormControl<string | null> {
    return this.userForm.get('phoneNumber') as FormControl<string | null>;
  }

  public get password(): FormControl<string | null> {
    return this.userForm.get('password') as FormControl<string | null>;
  }

  public get firstName(): FormControl<string | null> {
    return this.userForm.get('firstName') as FormControl<string | null>;
  }

  public get lastName(): FormControl<string | null> {
    return this.userForm.get('lastName') as FormControl<string | null>;
  }

  public get profileDescription(): FormControl<string | null> {
    return this.userForm.get('profileDescription') as FormControl<string | null>;
  }
}
