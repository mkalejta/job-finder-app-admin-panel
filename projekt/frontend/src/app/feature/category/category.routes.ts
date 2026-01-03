import { Routes } from '@angular/router';
import { CategoryForm } from './category-form/category-form';
import { CategoryList } from './category-list/category-list';
import { CategoryDetails } from './category-details/category-details';

export const CATEGORY_ROUTES: Routes = [
    {
        path: '',
        component: CategoryList
    },
    {
        path: 'form',
        component: CategoryForm,
        title: 'Create Category'
    },
    {
        path: ':id/details',
        component: CategoryDetails
    },
    {
        path: ':id/form',
        component: CategoryForm,
        title: 'Edit Category'
    }
];
