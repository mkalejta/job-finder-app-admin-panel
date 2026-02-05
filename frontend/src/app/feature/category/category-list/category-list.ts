import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SortPanelComponent } from '../../../shared/sort-panel/sort-panel';
import { FilterPanelComponent } from '../../../shared/filter-panel/filter-panel';
import { FormsModule } from '@angular/forms';
import { CategoryColorService } from '../../category-color.service';
import { CategoryFilteringParams, CategoryService } from '../category.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { toSignal } from '@angular/core/rxjs-interop';
import { UUIDTypes } from 'uuid';
import { FilterField } from '../../../interface/FilterField';
import { SortingParams } from '../../../interface/SortingParams';
import { CategoryColor } from '../../../shared/enums/CategoryColor';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, SortPanelComponent, FilterPanelComponent, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private categoryColorService = inject(CategoryColorService);
  private categoryService = inject(CategoryService);
  private paginationService = inject(PaginationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  public categories = toSignal(this.categoryService.categories$, { initialValue: [] });
  public pageInfo = toSignal(this.categoryService.pageInfo$, {
    initialValue: { first: true, last: true, totalPages: 0 }
  });
  public pagination = toSignal(this.paginationService.pagination$, {
    initialValue: { page: 0, size: 20 }
  });

  public pageSizeOptions = [20, 10, 5];

  public sortFields = [
    { id: 'name', label: 'Category Name' },
    { id: 'createdAt', label: 'Created At' },
  ];

  public filteringParams: CategoryFilteringParams = {
    filters: {
      name: '',
    },
  };

  public ngOnInit(): void {
    this.paginationService.reset();
    this.categoryService.loadCategories();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSortChange(config: SortingParams): void {
    this.categoryService.setSortParams(config);
  }

  public onFilterChange(params: CategoryFilteringParams): void {
    this.filteringParams = params;
    this.categoryService.setFilteringParams(params);
  }

  public onPageSizeChange(size: number): void {
    this.paginationService.setPageSize(size);
  }

  public onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  public goToAddCategory(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  public goCategoryDetails(categoryId: UUIDTypes): void {
    this.router.navigate([categoryId, 'details'], { relativeTo: this.route });
  }

  public getCategoryBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }

  public getCategoryTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }

  public get filterFields(): FilterField[] {
    return [
      {
        id: 'name',
        label: 'Category Name',
        type: 'text',
      },
    ];
  }
}