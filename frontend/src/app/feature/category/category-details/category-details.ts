import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CategoryService } from '../category.service';
import { UUIDTypes } from 'uuid';
import { CommonModule } from '@angular/common';
import { CategoryColorService } from '../../category-color.service';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { Category } from '../../../interface/category/category';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-details',
  imports: [RouterOutlet, CommonModule, MatIconModule],
  templateUrl: './category-details.html',
  styleUrl: './category-details.scss',
})
export class CategoryDetailsComponent implements OnInit {
  private categoryColorService = inject(CategoryColorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  public category?: Category;
  public categories: Category[] | [] = [];
  public currentIndex?: number;

  public ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    this.route.params.subscribe((params) => {
      const id = params['id'] as UUIDTypes;
      this.category = this.categories.find((cat) => cat.id === id);
      this.currentIndex = this.getCategoryIndexById(id);
    });
  }

  public goBack(): void {
    this.router.navigate(['categories']);
  }

  public nextCategory(): void {
    if (!this.category || this.currentIndex === undefined) {
      return;
    }
    if (this.currentIndex === this.categories.length - 1) {
      return;
    }
    this.router.navigate(['categories', this.categories[this.currentIndex + 1].id, 'details']);
  }

  public previousCategory(): void {
    if (!this.category || this.currentIndex === undefined) {
      return;
    }
    if (this.currentIndex === 0) {
      return;
    }
    this.router.navigate(['categories', this.categories[this.currentIndex - 1].id, 'details']);
  }

  public isFirstCategory(): boolean {
    return !this.category || this.currentIndex === 0;
  }

  public isLastCategory(): boolean {
    return !this.category || this.currentIndex === this.categories.length - 1;
  }

  public goToCategoryForm(category: Category): void {
    this.router.navigate([category.id, 'form'], { relativeTo: this.route.parent });
  }

  public deleteCategory(categoryId: UUIDTypes): void {
    if (this.currentIndex === undefined) {
      return;
    }
    
    this.confirmationService.confirmDanger(
      'Delete category',
      `Are you sure you want to delete the category "${this.category?.name}"? This action is irreversible and will delete all associated tags.`
    ).subscribe((confirmed) => {
      if (!confirmed) return;
      
      const nextIndex = this.currentIndex! < this.categories.length - 1 
        ? this.currentIndex! 
        : this.currentIndex! - 1;
      
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          if (nextIndex >= 0 && this.categories.length > 1) {
            const nextCategory = this.categories[nextIndex === this.currentIndex ? nextIndex + 1 : nextIndex];
            this.router.navigate(['categories', nextCategory.id, 'details']);
          } else {
            this.router.navigate(['categories']);
          }
        },
        error: () => {
          // Error already handled in service
        }
      });
    });
  }

  public getCategoryBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }
  
  public getCategoryTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }

  private getCategoryIndexById(categoryId: UUIDTypes): number {
    return this.categories.findIndex((cat) => cat.id === categoryId);
  }
}
