import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { NotFound } from './core/not-found/not-found';
import { LoginForm } from './auth/login-form/login-form';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: Home
    },
    {
        path: 'login',
        component: LoginForm
    },
    {
        path: 'users',
        loadChildren: () =>
            import('./feature/user/user.routes').then((m) => m.USER_ROUTES)
    },
    {
        path: '**',
        component: NotFound
    }
];
