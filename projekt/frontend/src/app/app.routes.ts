import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { NotFound } from './core/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: Home
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
