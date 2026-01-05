import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import Category from '../../interface/category/Category';
import { environment } from '../../../environments/environment';
import ResponseDto from '../../interface/ResponseDto';
import { FilteringParams } from '../../interface/FilteringParams';
import PageResponse from '../../interface/PageResponse';
import SortingParams from '../../interface/SortingParams';
import PaginationParams from '../../interface/PaginationParams';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { UUIDTypes } from 'uuid';
import CategoryCreateDto from '../../interface/category/CategoryCreateDto';
import { NotificationService } from '../../core/services/notification.service';

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
  categories$: Observable<Category[] | []> = this.categories.asObservable();
  pageInfo$: Observable<{ first: boolean; last: boolean; totalPages: number }> = this.pageInfo.asObservable();

  constructor() {
    combineLatest([
      this.sortParams.asObservable(),
      this.paginationService.pagination$,
      this.filteringParams.asObservable()
    ]).subscribe(([sort, pagination, filtering]) => {
      this.fetchCategories(sort, pagination, filtering).subscribe();
    });
  }

  private fetchCategories(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: CategoryFilteringParams): Observable<Category[]> {
    const sortField = sortParams?.sort || 'name';
    const sortDirection = (sortParams?.direction || 'ASC').toUpperCase();
    const page = paginationParams?.page || 0;
    const size = paginationParams?.size || 20;
    const filters = filteringParams?.filters || {};

    const httpParams = {
      ...(filters.name && typeof filters.name === 'string' && filters.name.trim() !== '' ? { name: filters.name.trim() } : {}),
      page: page.toString(),
      size: size.toString(),
      sort: `${sortField},${sortDirection.toLowerCase()}`
    };

    return this.http.get<ResponseDto<PageResponse<Category>>>(this.categoryUrl, { params: httpParams }).pipe(
      map((response) => response.data),
      tap((pageData) => {
        this.setCategories(pageData?.content || []);
        this.pageInfo.next({
          first: pageData?.first ?? true,
          last: pageData?.last ?? true,
          totalPages: pageData?.totalPages ?? 0
        });
      }),
      map((pageData) => pageData?.content || []),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Could not fetch categories');
        return of(this.categories.value);
      })
    );
  }

  private createCategoryRequest(category: CategoryCreateDto): Observable<Category> {
    return this.http.post<ResponseDto<Category>>(this.categoryAdminUrl, category).pipe(
      map((response) => response.data),
      tap((newCategory) => {
        if (newCategory) {
          this.notificationService.success('Category created successfully');
          this.loadCategories();
        }
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Could not create category');
        return of(err.error);
      })
    );
  }

  private updateCategoryRequest(category: CategoryCreateDto, categoryId: UUIDTypes): Observable<Category> {
    return this.http.put<ResponseDto<Category>>(`${this.categoryAdminUrl}/${categoryId}`, category).pipe(
      map((response) => response.data),
      tap((updatedCategory) => {
        if (updatedCategory) {
          this.notificationService.success('Category updated successfully');
          this.loadCategories();
        }
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Could not update category');
        return of(err.error);
      })
    );
  }

  private deleteCategoryRequest(categoryId: UUIDTypes): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.categoryAdminUrl}/${categoryId}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Category deleted successfully');
        this.loadCategories();
      }),
      catchError((err) => {
        this.notificationService.error(err.error?.message || 'Could not delete category');
        return of(err.error);
      })
    );
  }

  loadCategories(): void {
    this.setSortParams({});
    this.setFilteringParams({ filters: {} });
  }

  setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
  }

  setFilteringParams(params: CategoryFilteringParams): void {
    this.filteringParams.next(params);
  }

  getCategories(): Category[] {
    return this.categories.value;
  }

  setCategories(categories: Category[]): void {
    if (!categories) return;
    this.categories.next(categories);
  }

  createCategory(category: CategoryCreateDto): Observable<Category> {
    return this.createCategoryRequest(category);
  }

  updateCategory(updatedCategory: CategoryCreateDto, categoryId: UUIDTypes): Observable<Category> {
    return this.updateCategoryRequest(updatedCategory, categoryId);
  }

  deleteCategory(categoryId: UUIDTypes): Observable<void> {
    return this.deleteCategoryRequest(categoryId);
  }
}
