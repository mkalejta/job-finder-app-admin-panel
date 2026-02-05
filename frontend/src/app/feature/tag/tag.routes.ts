import { Routes } from '@angular/router';
import { TagListComponent } from './tag-list/tag-list';
import { TagFormComponent } from './tag-form/tag-form';
import { TagDetailsComponent } from './tag-details/tag-details';

export const TAG_ROUTES: Routes = [
    {
        path: '',
        component: TagListComponent
    },
    {
        path: 'form',
        component: TagFormComponent,
        title: 'Create Tag'
    },
    {
        path: ':id/details',
        component: TagDetailsComponent
    },
    {
        path: ':id/form',
        component: TagFormComponent,
        title: 'Edit Tag'
    }
];
