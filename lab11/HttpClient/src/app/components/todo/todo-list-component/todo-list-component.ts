import { Component, OnInit, signal } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../todo-service';
import { Todo } from '../../../models/Todo';


@Component({
  selector: 'app-todo-list-component',
  imports: [MatList, MatListItem],
  templateUrl: './todo-list-component.html',  
  styleUrl: './todo-list-component.scss'
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[] | []>([]);

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private todosService: TodoService
  ) {}

  ngOnInit(): void {
    this.todosService.todos$.subscribe((todos: Todo[] | []) => {
      this.todos.set(todos);
    });
  }

  goToTodoDetails(todoId: number): void {
    this.router.navigate([todoId, 'details'], { relativeTo: this.route });
  }

  goToTodoForm(todo: Todo): void {
    this.router.navigate([todo.id, "form"], { relativeTo: this.route });
  }

  deleteTodo(todoId: number): void {
    const updatedTodos = this.todos().filter(todo => todo.id !== todoId);
    this.todosService.setTodos(updatedTodos);
  }
}
