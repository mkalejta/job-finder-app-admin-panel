import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../environments/environment';
import { catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import ResponseDto from '../../interface/ResponseDto';
import TagCreateDto from '../../interface/tag/TagCreateDto';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import Tag from '../../interface/tag/tag';
import SortingParams from '../../interface/SortingParams';
import PaginationParams from '../../interface/PaginationParams';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { FilteringParams } from '../../interface/FilteringParams';

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
  
  private tags = new BehaviorSubject<Tag[]>([]);
  private tagUrl = environment.apiUrl + '/tag';
  private tagAdminUrl = environment.apiUrl + '/admin/tag';
  tags$: Observable<Tag[] | []> = this.tags.asObservable();
  private sortParams = new BehaviorSubject<SortingParams>({});
  private filteringParams = new BehaviorSubject<TagFilteringParams>({ filters: {} });

  constructor() {
    combineLatest([
      this.sortParams.asObservable(),
      this.paginationService.pagination$,
      this.filteringParams.asObservable()
    ]).subscribe(([sort, pagination, filtering]) => {
      this.fetchTags(sort, pagination, filtering).subscribe();
    });
  }

  private fetchTags(sortParams: SortingParams, paginationParams: PaginationParams, filteringParams: TagFilteringParams): Observable<Tag[]> {
    const sortField = sortParams?.sort || 'name';
    const sortDirection = (sortParams?.direction || 'ASC').toUpperCase();
    const page = paginationParams?.page || 0;
    const size = paginationParams?.size || 20;
    const filters = filteringParams?.filters || {};

    const httpParams = {
      ...(filters.name && typeof filters.name === 'string' && filters.name.trim() !== '' ? { name: filters.name.trim() } : {}),
      ...(filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0 ? { categories: filters.categories.join(',') } : {}),
      page: page.toString(),
      size: size.toString(),
      sort: `${sortField},${sortDirection.toLowerCase()}`
    };

    return this.http.get<ResponseDto<{ content: Tag[] }>>(this.tagUrl, { params: httpParams }).pipe(
      map((response) => response.data?.content),
      tap((data) => this.setTags(data)),
      catchError((err) => {
        console.error('Error fetching tags:', err);
        return of(this.tags.value);
      })
    );
  }

  private createTagRequest(tag: TagCreateDto): Observable<Tag> {
    return this.http.post<ResponseDto<Tag>>(this.tagAdminUrl, tag).pipe(
      map((response) => response.data),
      tap((newTag) => {
        if (newTag) {
          this.loadTags();
        }
      }),
      catchError((err) => {
        console.error('Error adding tag:', err);
        return of(err.error);
      })
    );
  }

  private updateTagRequest(tag: TagCreateDto, tagId: UUIDTypes): Observable<Tag> {
    return this.http.put<ResponseDto<Tag>>(`${this.tagAdminUrl}/${tagId}`, tag).pipe(
      map((response) => response.data),
      tap((updatedTag) => {
        if (updatedTag) {
          this.loadTags();
        }
      }),
      catchError((err) => {
        console.error('Error updating tag:', err);
        return of(err.error);
      })
    );
  }

  private deleteTagRequest(tagId: UUIDTypes): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.tagAdminUrl}/${tagId}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.loadTags();
      }),
      catchError((err) => {
        console.error('Error deleting tag:', err);
        return of(err.error);
      })
    );
  }
    
  loadTags(sortParams?: SortingParams, filteringParams?: TagFilteringParams): void {
    if (sortParams) {
      this.sortParams.next(sortParams);
    }
    if (filteringParams) {
      this.filteringParams.next(filteringParams);
    }
  }

  setSortParams(params: SortingParams): void {
    this.sortParams.next(params);
  }

  setFilteringParams(params: TagFilteringParams): void {
    this.filteringParams.next(params);
  }

  setTags(tags: Tag[]): void {
    if (!tags) return;
    this.tags.next(tags);
  }

  getTags(): Tag[] {
    return this.tags.value;
  }

  createTag(tag: TagCreateDto): void {
    this.createTagRequest(tag).subscribe();
  }

  updateTag(updatedTag: TagCreateDto, tagId: UUIDTypes): void {
    this.updateTagRequest(updatedTag, tagId).subscribe();
  }

  deleteTag(tagId: UUIDTypes): void {
    this.deleteTagRequest(tagId).subscribe();
  }

  generateId(): UUIDTypes {
    return uuidv4();
  }

  getTagIndexById(tagId: UUIDTypes): number {
    const currentTags = this.tags.value;
    return currentTags.findIndex(tag => tag.id === tagId);
  }
}
