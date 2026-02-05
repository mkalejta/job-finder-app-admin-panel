import { Routes } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form';
import { CategoryListComponent } from './category-list/category-list';
import { CategoryDetailsComponent } from './category-details/category-details';

export const CATEGORY_ROUTES: Routes = [
    {
        path: '',
        component: CategoryListComponent
    },
    {
        path: 'form',
        component: CategoryFormComponent,
        title: 'Create Category'
    },
    {
        path: ':id/details',
        component: CategoryDetailsComponent
    },
    {
        path: ':id/form',
        component: CategoryFormComponent,
        title: 'Edit Category'
    }
];
