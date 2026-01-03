import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SortPanel } from '../../../shared/sort-panel/sort-panel';
import { FilterPanel } from '../../../shared/filter-panel/filter-panel';
import { FormsModule } from '@angular/forms';
import { CategoryColorService } from '../../category-color.service';
import { CategoryFilteringParams, CategoryService } from '../category.service';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { toSignal } from '@angular/core/rxjs-interop';
import { UUIDTypes } from 'uuid';
import { FilterField } from '../../../interface/FilterField';
import SortingParams from '../../../interface/SortingParams';
import { CategoryColor } from '../../../shared/enums/CategoryColor';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, SortPanel, FilterPanel, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit, OnDestroy {
  private categoryColorService = inject(CategoryColorService);
  private categoryService = inject(CategoryService);
  private paginationService = inject(PaginationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  categories = toSignal(this.categoryService.categories$, { initialValue: [] });
  pagination = toSignal(this.paginationService.pagination$, {
    initialValue: { page: 0, size: 20 }
  });

  pageSizeOptions = [20, 10, 5];

  sortFields = [
    { id: 'name', label: 'Category Name' },
    { id: 'createdAt', label: 'Created At' },
  ];

  filteringParams: CategoryFilteringParams = {
    filters: {
      name: '',
    },
  };

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortChange(config: SortingParams): void {
    this.categoryService.setSortParams(config);
  }

  onFilterChange(params: CategoryFilteringParams): void {
    this.filteringParams = params;
    this.categoryService.setFilteringParams(params);
  }

  onPageSizeChange(size: number): void {
    this.paginationService.setPageSize(size);
  }

  onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  goToAddCategory(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goCategoryDetails(categoryId: UUIDTypes): void {
    this.router.navigate([categoryId, 'details'], { relativeTo: this.route });
  }

  getCategoryBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }

  getCategoryTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }

  get filterFields(): FilterField[] {
    return [
      {
        id: 'name',
        label: 'Category Name',
        type: 'text',
      },
    ];
  }
}