import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import Category from '../../interface/category/category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private categories = new BehaviorSubject<Category[]>(this.readStorage());
  private categoryUrl = environment.apiUrl + '/category';
  private categoryAdminUrl = environment.apiUrl + '/admin/category';
  categories$: Observable<Category[] | []> = this.categories.asObservable();

  private readStorage(): Category[] | [] {
    try {
      const raw = localStorage.getItem('categories');
      if (!raw) return [];
      const data = JSON.parse(raw) as Category[];
      return data;
    } catch (e){
      console.error('Failed to read categories from storage', e);
      return [];
    }
  }

  private writeStorage(categories: Category[]): void {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to write categories to storage', e);
    }
  }

  private fetchCategories(): Observable<Category[]> {
    return this.http.get<{ data: { content: Category[] } }>(this.categoryUrl).pipe(
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
    this.categories.next(categories);
    this.writeStorage(categories);
  }
}
