import { Routes } from '@angular/router';
import { UsersList } from './users-list/users-list';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UsersList
    }
];
