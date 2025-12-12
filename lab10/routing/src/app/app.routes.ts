import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/page-not-found-component/page-not-found-component';
import { InfoComponent } from './modules/info/info-component/info-component';
import { HomeComponent } from './modules/home-component/home-component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        title: 'Book List',
    },
    {
        path: 'books',
        loadChildren: () =>
            import('./modules/books/books.routes').then((m) => m.BOOK_ROUTES)
    },
    {
        path: 'info',
        component: InfoComponent,
        title: 'Info Page',
    },
    {
        path: '**',
        component: PageNotFoundComponent,
   }
];
