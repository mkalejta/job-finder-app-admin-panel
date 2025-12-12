import { Routes } from "@angular/router";
import { BookListComponent } from "./book-list-component/book-list-component";
import { BookDetailsComponent } from "./book-details-component/book-details-component";

export const BOOK_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: BookListComponent,
        title: 'Book List'
    },
    {
        path: ':id/details',
        component: BookDetailsComponent,
        title: 'Book Details'
    }
]