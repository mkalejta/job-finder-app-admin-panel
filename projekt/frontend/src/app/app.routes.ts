import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home';
import { NotFoundComponent } from './core/not-found/not-found';
import { LoginFormComponent } from './auth/login-form/login-form';
import { AuthGuardService } from './auth/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginFormComponent
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
        path: 'categories',
        loadChildren: () =>
            import('./feature/category/category.routes').then((m) => m.CATEGORY_ROUTES),
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
