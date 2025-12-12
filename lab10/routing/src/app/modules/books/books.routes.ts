import { Routes } from "@angular/router";
import { BookListComponent } from "./book-list-component/book-list-component";
import { BookDetailsComponent } from "./book-details-component/book-details-component";
import { BookFormComponent } from "./book-form-component/book-form-component";

export const BOOK_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: BookListComponent,
        title: 'Book List'
    },
    {
        path: 'form',
        component: BookFormComponent,
        title: 'Book Form'
    },
    {
        path: ':id/form',
        component: BookFormComponent,
        title: 'Book Form'
    },
    {
        path: ':id/details',
        component: BookDetailsComponent,
        title: 'Book Details'
    }
]