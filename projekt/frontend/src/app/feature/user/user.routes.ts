import { Routes } from '@angular/router';
import { UsersList } from './users-list/users-list';
import { UserDetails } from './user-details/user-details';
import { UserForm } from './user-form/user-form';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UsersList
    },
    {
        path: 'form',
        component: UserForm,
        title: 'Create User'
    },
    {
        path: ':id/details',
        component: UserDetails
    },
    {
        path: ':id/form',
        component: UserForm,
        title: 'Edit User'
    }
];
