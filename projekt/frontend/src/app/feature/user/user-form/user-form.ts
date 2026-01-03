import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import User from '../../../interface/user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';
import { Location } from '@angular/common';
import { UUIDTypes } from 'uuid';
import UserCreateDto from '../../../interface/user/UserCreateDto';
import UserUpdateDto from '../../../interface/user/UserUpdateDto';
import { passwordValidator } from '../../../shared/validators/password.validator';
import { usernameValidator } from '../../../shared/validators/username.validator';
import { emailValidator } from '../../../shared/validators/email.validator';
import { phoneNumberValidator } from '../../../shared/validators/phone-number.validator';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private usersService = inject(UsersService);
  userForm!: FormGroup;
  user?: User;
  isEditMode = false;
  userId?: UUIDTypes;

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      const id = params['id'];
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
            phoneNumber: this.user.phoneNumber,
          });
        }
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, usernameValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      password: ['', this.isEditMode ? [] : [Validators.required, passwordValidator()]],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId && this.user) {
      const updatedUser: UserUpdateDto = {
        username: formValue.username,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber
      };
      this.usersService.updateUser(updatedUser, this.userId);
    } else {
      const newUser: UserCreateDto = {
        username: formValue.username,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        password: formValue.password
      };
      this.usersService.createUser(newUser);
    }

    this.router.navigate(['users']);
  }

  goBack(): void {
    this.location.back();
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }
  
  get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }

  get password() {
    return this.userForm.get('password');
  }
}
