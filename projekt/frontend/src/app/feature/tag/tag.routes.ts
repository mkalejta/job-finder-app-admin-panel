import { Routes } from '@angular/router';
import { TagList } from './tag-list/tag-list';
import { TagForm } from './tag-form/tag-form';
import { TagDetails } from './tag-details/tag-details';

export const TAG_ROUTES: Routes = [
    {
        path: '',
        component: TagList
    },
    {
        path: 'form',
        component: TagForm,
        title: 'Create Tag'
    },
    {
        path: ':id/details',
        component: TagDetails
    },
    {
        path: ':id/form',
        component: TagForm,
        title: 'Edit Tag'
    }
];
