import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import User from '../../../interface/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users-service.service';
import { Location } from '@angular/common';
import { UUIDTypes } from 'uuid';

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
        
        if (this.user) {
          this.userForm.patchValue({
            username: this.user.username,
            email: this.user.email,
            firstName: this.user.firstName,
            lastName: this.user.lastName
          });
        }
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId && this.user) {
      const updatedUser: User = {
        id: this.userId,
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        createdAt: this.user.createdAt,
        updatedAt: new Date()
      };
      this.usersService.updateUser(updatedUser);
    } else {
      const newUser: User = {
        id: this.usersService.generateId(),
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.usersService.addUser(newUser);
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

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }
}
