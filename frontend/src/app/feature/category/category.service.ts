import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { Category } from '../../interface/category/category';
import { environment } from '../../../environments/environment';
import { ResponseDto }from '../../interface/ResponseDto';
import { FilteringParams } from '../../interface/FilteringParams';
import { PageResponse } from '../../interface/PageResponse';
import { SortingParams } from '../../interface/SortingParams';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { UUIDTypes } from 'uuid';
import { CategoryCreateDto } from '../../interface/category/CategoryCreateDto';
import { NotificationService } from '../../core/services/notification.service';
import { PaginationParams } from '../../interface/PaginationParams';

export interface CategoryFilters {
  [key: string]: unknown;
  name?: string;
}
export type CategoryFilteringParams = FilteringParams<CategoryFilters>;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private paginationService = inject(PaginationService);
  private notificationService = inject(NotificationService);

  private categories = new BehaviorSubject<Category[]>([]);
  private pageInfo = new BehaviorSubject<{ first: boolean; last: boolean; totalPages: number }>({ first: true, last: true, totalPages: 0 });
  private categoryUrl = environment.apiUrl + '/category';
  private categoryAdminUrl = environment.apiUrl + '/admin/category';
  private sortParams = new BehaviorSubject<SortingParams>({});
  private filteringParams = new BehaviorSubject<CategoryFilteringParams>({ filters: {} });
  public categories$: Observable<Category[] | []> = this.categories.asObservable();
  public pageInfo$: Observable<{ first: boolean; last: boolean; totalPages: number }> = this.pageInfo.asObservable();

  public constructor() {
    combineLatest([
      this.sortParams.asObservable(),
      this.paginationService.pagination$,
      this.filteringParams.asObservable()
    ]).subscribe(([sort, pagination, filtering]) => {
      this.fetchCategories(sort, pagination, filtering).subscribe();
    });
  }

  private fetchCategories(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: CategoryFilteringParams): Observable<Category[]> {
    const sortField = sortParams.sort || 'name';
    const sortDirection = (sortParams.direction || 'ASC').toUpperCase();
    const page = paginationParams.page || 0;
    const size = paginationParams.size || 20;
    const filters = filteringParams.filters;

    const httpParams = this.buildHttpParams(filters, page, size, sortField, sortDirection);

    return this.http.get<ResponseDto<PageResponse<Category>>>(this.categoryUrl, { params: httpParams }).pipe(
      map((response) => response.data),
      tap((pageData) => {
        this.updatePageData(pageData);
      }),
      map((pageData) => pageData.content ),
      catchError((err: { error?: { message?: string } }) => {
        this.notificationService.error(err.error?.message || 'Could not fetch categories');

        return of(this.categories.value);
      })
    );
  }

  private buildHttpParams(filters: CategoryFilters, page: number, size: number, sortField: string, sortDirection: string): Record<string, string> {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
      sort: `${sortField},${sortDirection.toLowerCase()}`
    };

    if (filters.name && typeof filters.name === 'string' && filters.name.trim() !== '') {
      params['name'] = filters.name.trim();
    }

    return params;
  }

  private updatePageData(pageData: PageResponse<Category>): void {
    this.setCategories(pageData.content );
    this.pageInfo.next({
      first: pageData.first,
      last: pageData.last,
      totalPages: pageData.totalPages
    });
  }

  private createCategoryRequest(category: CategoryCreateDto): Observable<Category> {
    return this.http.post<ResponseDto<Category>>(this.categoryAdminUrl, category).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Category created successfully');
        this.loadCategories();
      }),
      catchError((err: { error?: { message?: string } }) => {
        this.notificationService.error(err.error?.message || 'Could not create category');

        return of({} as Category);
      })
    );
  }

  private updateCategoryRequest(category: CategoryCreateDto, categoryId: string): Observable<Category> {
    return this.http.put<ResponseDto<Category>>(`${this.categoryAdminUrl}/${categoryId}`, category).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Category updated successfully');
        this.loadCategories();
      }),
      catchError((err: { error?: { message?: string } }) => {
        this.notificationService.error(err.error?.message || 'Could not update category');

        return of({} as Category);
      })
    );
  }

  private deleteCategoryRequest(categoryId: string): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.categoryAdminUrl}/${categoryId}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Category deleted successfully');
        this.loadCategories();
      }),
      catchError((err: { error?: { message?: string } }) => {
        this.notificationService.error(err.error?.message || 'Could not delete category');

        return of(undefined as void);
      })
    );
  }

  public loadCategories(): void {
    this.setSortParams({});
    this.setFilteringParams({ filters: {} });
  }

  public setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
  }

  public setFilteringParams(params: CategoryFilteringParams): void {
    this.filteringParams.next(params);
  }

  public getCategories(): Category[] {
    return this.categories.value;
  }

  public setCategories(categories: Category[]): void {
    this.categories.next(categories);
  }

  public createCategory(category: CategoryCreateDto): Observable<Category> {
    return this.createCategoryRequest(category);
  }

  public updateCategory(updatedCategory: CategoryCreateDto, categoryId: UUIDTypes): Observable<Category> {
    return this.updateCategoryRequest(updatedCategory, categoryId as string);
  }

  public deleteCategory(categoryId: UUIDTypes): Observable<void> {
    return this.deleteCategoryRequest(categoryId as string);
  }
}
