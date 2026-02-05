import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginationParams } from '../../interface/PaginationParams';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private defaultPageSize = 20;
  private defaultPage = 0;
  private paginationSubject = new BehaviorSubject<PaginationParams>({
    page: this.defaultPage,
    size: this.defaultPageSize,
  });

  public pagination$: Observable<PaginationParams> = this.paginationSubject.asObservable();

  public setPagination(params: PaginationParams): void {
    this.paginationSubject.next(params);
  }

  public getPagination(): PaginationParams {
    return this.paginationSubject.value;
  }

  public setPage(page: number): void {
    const current = this.paginationSubject.value;
    this.paginationSubject.next({ ...current, page });
  }

  public setPageSize(size: number): void {
    const current = this.paginationSubject.value;
    this.paginationSubject.next({ ...current, size });
  }

  public reset(): void {
    this.paginationSubject.next({
      page: this.defaultPage,
      size: this.defaultPageSize,
    });
  }
}
