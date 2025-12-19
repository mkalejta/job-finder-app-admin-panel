import { Routes } from '@angular/router';
import { HomeComponent } from './components/core/home-component/home-component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: 'todos',
        loadChildren: () =>
            import('./components/todo/todo.routes').then((m) => m.TODO_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
