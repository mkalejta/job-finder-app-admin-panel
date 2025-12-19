import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../../models/Todo'

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = new BehaviorSubject<Todo[] | []>([]);
  todos$: Observable<Todo[] | []> = this.todos.asObservable()

  constructor(private http: HttpClient) {
    this.fetchTodos();
  }

  private fetchTodos(): void {
    this.http.get<Todo[]>('http://localhost:3000/todos')
      .subscribe((data) => {
        this.todos.next(data);
      });
  }

  setTodos(todos: Todo[] | []): void {
    this.todos.next(todos);
  }
}
