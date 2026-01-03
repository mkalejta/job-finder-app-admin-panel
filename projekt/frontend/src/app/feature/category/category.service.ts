import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import Category from '../../interface/category/category';
import { environment } from '../../../environments/environment';
import ResponseDto from '../../interface/ResponseDto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private categories = new BehaviorSubject<Category[]>([]);
  private categoryUrl = environment.apiUrl + '/category';
  private categoryAdminUrl = environment.apiUrl + '/admin/category';
  categories$: Observable<Category[] | []> = this.categories.asObservable();

  private fetchCategories(): Observable<Category[]> {
    return this.http.get<ResponseDto<{ content: Category[] }>>(this.categoryUrl).pipe(
      map((response) => response.data?.content),
      tap((data) => this.setCategories(data)),
      catchError((err) => {
        console.error('Error fetching categories:', err);
        return of(this.categories.value);
      })
    );
  }

  loadCategories(): void {
    this.fetchCategories().subscribe();
  }

  getCategories(): Category[] {
    return this.categories.value;
  }

  setCategories(categories: Category[]): void {
    if (!categories) return;
    this.categories.next(categories);
  }
}
