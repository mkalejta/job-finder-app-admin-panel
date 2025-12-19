import { Routes } from "@angular/router";
import { TodoListComponent } from "./todo-list-component/todo-list-component";
import { TodoFormComponent } from "./todo-form-component/todo-form-component";
import { TodoDetailsComponent } from "./todo-details-component/todo-details-component";

export const TODO_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TodoListComponent,
        title: 'Todo List'
    },
    {
        path: 'details/:id',
        component: TodoDetailsComponent,
        title: 'Todo Details'
    },
    {
        path: 'form',
        component: TodoFormComponent,
        title: 'Todo Form'
    },
    {
        path: 'form/:id',
        component: TodoFormComponent,
        title: 'Todo Form'
    },
]