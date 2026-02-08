import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../environments/environment';
import { catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { ResponseDto } from '../../interface/ResponseDto';
import { PageResponse } from '../../interface/PageResponse';
import { TagCreateDto } from '../../interface/tag/TagCreateDto';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { SortingParams } from '../../interface/SortingParams';
import { PaginationParams } from '../../interface/PaginationParams';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { FilteringParams } from '../../interface/FilteringParams';
import { Tag } from '../../interface/tag/tag';
import { NotificationService } from '../../core/services/notification.service';

export interface TagFilters {
  [key: string]: unknown;
  name?: string;
  categories?: string[];
}
export type TagFilteringParams = FilteringParams<TagFilters>;

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private http = inject(HttpClient);
  private paginationService = inject(PaginationService);
  private notificationService = inject(NotificationService);
  
  private tags = new BehaviorSubject<Tag[]>([]);
  private pageInfo = new BehaviorSubject<{ first: boolean; last: boolean; totalPages: number }>({ first: true, last: true, totalPages: 0 });
  private tagUrl = environment.apiUrl + '/tag';
  private tagAdminUrl = environment.apiUrl + '/admin/tag';
  private sortParams = new BehaviorSubject<SortingParams>({});
  private filteringParams = new BehaviorSubject<TagFilteringParams>({ filters: {} });
  public tags$: Observable<Tag[] | []> = this.tags.asObservable();
  public pageInfo$: Observable<{ first: boolean; last: boolean; totalPages: number }> = this.pageInfo.asObservable();

  public constructor() {
    combineLatest([
      this.sortParams.asObservable(),
      this.paginationService.pagination$,
      this.filteringParams.asObservable()
    ]).subscribe(([sort, pagination, filtering]) => {
      this.fetchTags(sort, pagination, filtering).subscribe();
    });
  }

  private buildHttpParams(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: TagFilteringParams): HttpParams {
    const sortField = sortParams.sort && sortParams.sort.trim() ? sortParams.sort : 'name';
    const sortDirection = (sortParams.direction || 'ASC').toUpperCase();
    const page = paginationParams.page || 0;
    const size = paginationParams.size || 20;
  
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortField},${sortDirection.toLowerCase()}`);
  
    params = this.applyNameFilter(params, filteringParams.filters);
    params = this.applyCategoriesFilter(params, filteringParams.filters);
  
    return params;
  }
  
  private applyNameFilter(params: HttpParams, filters: TagFilters): HttpParams {
    if (typeof filters.name === 'string' && filters.name.trim()) {
      return params.set('name', filters.name.trim());
    }

    return params;
  }
  
  private applyCategoriesFilter(params: HttpParams, filters: TagFilters): HttpParams {
    if (Array.isArray(filters.categories) && filters.categories.length > 0) {
      return params.set('categories', filters.categories.join(','));
    }

    return params;
  }

  private handleError<T>(fallback: T, message: string) {
    return (err: unknown): Observable<T> => {
      const apiMessage = (err as { error?: { message?: string } }).error?.message;
      this.notificationService.error(apiMessage || message);

      return of(fallback);
    };
  }

  private fetchTags(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: TagFilteringParams): Observable<Tag[]> {
    const params = this.buildHttpParams(sortParams, paginationParams, filteringParams);

    return this.http.get<ResponseDto<PageResponse<Tag>>>(this.tagUrl, { params }).pipe(
      map((response) => ({
        content: response.data.content,
        first: response.data.first,
        last: response.data.last,
        totalPages: response.data.totalPages
      })),
      tap((pageData) => {
        this.setTags(pageData.content);
        this.pageInfo.next({
          first: pageData.first,
          last: pageData.last,
          totalPages: pageData.totalPages
        });
      }),
      map((pageData) => pageData.content),
      catchError(this.handleError(this.tags.value, 'Failed to fetch the list of tags'))
    );
  }

  private createTagRequest(tag: TagCreateDto): Observable<Tag> {
    return this.http.post<ResponseDto<Tag>>(this.tagAdminUrl, tag).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Tag has been created successfully');
        this.loadTags();
      }),
      catchError(this.handleError({} as Tag, 'Failed to create the tag'))
    );
  }

  private updateTagRequest(tag: TagCreateDto, tagId: UUIDTypes): Observable<Tag> {
    return this.http.put<ResponseDto<Tag>>(`${this.tagAdminUrl}/${String(tagId)}`, tag).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Tag has been updated successfully');
        this.loadTags();
      }),
      catchError(this.handleError({} as Tag, 'Failed to update the tag'))
    );
  }

  private deleteTagRequest(tagId: UUIDTypes): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.tagAdminUrl}/${String(tagId)}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.notificationService.success('Tag has been deleted successfully');
        this.loadTags();
      }),
      catchError(this.handleError(undefined, 'Failed to delete the tag'))
    );
  }
    
  public loadTags(sortParams?: SortingParams, filteringParams?: TagFilteringParams): void {
    if (sortParams) {
      this.sortParams.next(sortParams);
    }
    if (filteringParams) {
      this.filteringParams.next(filteringParams);
    }
  }

  public setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
  }

  public setFilteringParams(params: TagFilteringParams): void {
    this.filteringParams.next(params);
  }

  public setTags(tags: Tag[]): void {
    this.tags.next(tags);
  }

  public getTags(): Tag[] {
    return this.tags.value;
  }

  public createTag(tag: TagCreateDto): Observable<Tag> {
    return this.createTagRequest(tag);
  }

  public updateTag(updatedTag: TagCreateDto, tagId: UUIDTypes): Observable<Tag> {
    return this.updateTagRequest(updatedTag, tagId);
  }

  public deleteTag(tagId: UUIDTypes): Observable<void> {
    return this.deleteTagRequest(tagId);
  }

  public generateId(): UUIDTypes {
    return uuidv4();
  }

  public getTagIndexById(tagId: UUIDTypes): number {
    const currentTags = this.tags.value;

    return currentTags.findIndex((tag) => tag.id === tagId);
  }

  public getTagsByCategoryId(categoryId: UUIDTypes): Observable<Tag[]> {
    return this.http.get<ResponseDto<{ content: Tag[] }>>(`${this.tagUrl}/category/${String(categoryId)}`).pipe(
      map((response) => response.data.content),
      catchError(this.handleError<Tag[]>([], 'Failed to fetch tags for the category'))
    );
  }
}