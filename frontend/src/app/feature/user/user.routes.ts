import { Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list';
import { UserDetailsComponent } from './user-details/user-details';
import { UserFormComponent } from './user-form/user-form';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UsersListComponent
    },
    {
        path: 'form',
        component: UserFormComponent,
        title: 'Create User'
    },
    {
        path: ':id/details',
        component: UserDetailsComponent
    },
    {
        path: ':id/form',
        component: UserFormComponent,
        title: 'Edit User'
    }
];
