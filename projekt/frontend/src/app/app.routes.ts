import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { NotFound } from './core/not-found/not-found';
import { LoginForm } from './auth/login-form/login-form';
import { AuthGuardService } from './auth/auth-guard.service';

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
            import('./feature/user/user.routes').then((m) => m.USER_ROUTES),
        canActivate: [AuthGuardService]
    },
    {
        path: 'tags',
        loadChildren: () =>
            import('./feature/tag/tag.routes').then((m) => m.TAG_ROUTES),
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        component: NotFound
    }
];
