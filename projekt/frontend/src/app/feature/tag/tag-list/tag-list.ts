import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';
import { TagFilteringParams, TagsService } from '../tag.service';
import { CommonModule } from '@angular/common';
import { CategoryColorService } from '../../category-color.service';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { SortPanel } from '../../../shared/sort-panel/sort-panel';
import { FilterPanel } from '../../../shared/filter-panel/filter-panel';
import { FilterField } from '../../../interface/FilterField';
import SortingParams from '../../../interface/SortingParams';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-tag-list',
  imports: [CommonModule, SortPanel, FilterPanel, FormsModule],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
})
export class TagList implements OnInit, OnDestroy {
  private categoryColorService = inject(CategoryColorService);
  private categoryService = inject(CategoryService);
  private tagsService = inject(TagsService);
  private paginationService = inject(PaginationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  tags = toSignal(this.tagsService.tags$, { initialValue: [] });
  categories = toSignal(this.categoryService.categories$, { initialValue: [] });
  pagination = toSignal(this.paginationService.pagination$, {
    initialValue: { page: 0, size: 20 }
  });

  pageSizeOptions = [20, 10, 5];

  sortFields = [
    { id: 'name', label: 'Tag Name' },
    { id: 'createdAt', label: 'Created At' },
  ];

  filteringParams: TagFilteringParams = {
    filters: {
      name: '',
      categories: [],
    },
  };

  ngOnInit(): void {
    this.tagsService.loadTags();
    this.categoryService.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortChange(config: SortingParams): void {
    this.tagsService.setSortParams(config);
  }

  onFilterChange(params: TagFilteringParams): void {
    this.filteringParams = params;
    this.tagsService.setFilteringParams(params);
  }

  onPageSizeChange(size: number): void {
    this.paginationService.setPageSize(size);
  }

  onPageChange(page: number): void {
    this.paginationService.setPage(page);
  }

  goToAddTag(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToTagDetails(tagId: UUIDTypes): void {
    this.router.navigate([tagId, 'details'], { relativeTo: this.route });
  }

  getTagBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }

  getTagTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }
  
  get filterFields(): FilterField[] {
    return [
      {
        id: 'name',
        label: 'Tag Name',
        type: 'text',
      },
      {
        id: 'categories',
        label: 'Categories',
        type: 'checkbox',
        options: this.categories().map(category => ({
          id: category.name,
          label: category.name,
        })),
      },
    ];
  }
}
