import { Routes } from '@angular/router';
import { BookListComponent } from './modules/books/book-list-component/book-list-component';
import { PageNotFoundComponent } from './core/page-not-found-component/page-not-found-component';
import { InfoComponent } from './modules/info/info-component/info-component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/book',
        component: BookListComponent,
        title: 'Book List',
    },
    {
        path: 'book',
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
