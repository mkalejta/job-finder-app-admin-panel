import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { TagsService } from '../../tag/tag.service';
import { UUIDTypes } from 'uuid';
import CategoryCreateDto from '../../../interface/category/CategoryCreateDto';
import { Location } from '@angular/common';
import Category from '../../../interface/category/Category';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { CommonModule } from '@angular/common';
import { categoryAndTagValidator } from '../../../shared/validators/category-and-tag.validator';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private categoryService = inject(CategoryService);
  private tagsService = inject(TagsService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  
  categoryForm!: FormGroup;
  category?: Category;
  isEditMode = false;
  categoryId?: UUIDTypes;
  categoryColors = Object.values(CategoryColor);

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.categoryId = id;
        const categories = this.categoryService.getCategories();
        this.category = categories.find((cat) => cat.id === id);
        
        if (this.category) {
          this.categoryForm.patchValue({
            name: this.category.name,
            categoryColor: this.category.color,
          });
          this.loadExistingTags(id);
        }
      }
    });
  }

  private loadExistingTags(categoryId: UUIDTypes): void {
    this.tagsService.getTagsByCategoryId(categoryId).subscribe({
      next: (tags) => {
        const tagsArray = this.tags;
        while (tagsArray.length > 0) {
          tagsArray.removeAt(0);
        }
        
        tags.forEach(tag => {
          tagsArray.push(this.fb.group({
            id: [tag.id],
            name: [tag.name]
          }));
        });
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, categoryAndTagValidator()]],
      categoryColor: ['', [Validators.required]],
      tags: this.fb.array([]),
      newTagName: ['', [categoryAndTagValidator()]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');
      return;
    }

    const formValue = this.categoryForm.value;
    const categoryValues: CategoryCreateDto = {
      name: formValue.name,
      color: formValue.categoryColor
    };

    if (this.isEditMode && this.categoryId && this.category) {
      this.categoryService.updateCategory(categoryValues, this.categoryId).subscribe({
        next: () => {
          this.router.navigate(['categories']);
        },
        error: () => {
          // Error already handled in service
        }
      });
    } else {
      this.categoryService.createCategory(categoryValues).subscribe({
        next: () => {
          this.router.navigate(['categories']);
        },
        error: () => {
          // Error already handled in service
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  get name() {
    return this.categoryForm.get('name');
  }

  get categoryColor() {
    return this.categoryForm.get('categoryColor');
  }

  get newTagName() {
    return this.categoryForm.get('newTagName');
  }

  onAddTag(): void {
    const tagName = this.newTagName?.value?.trim();
    
    if (!tagName) {
      this.notificationService.warning('Please enter a tag name.');
      return;
    }

    if (this.newTagName?.invalid) {
      this.notificationService.warning('Tag name must start with capital letter and contain only small letters.');
      return;
    }

    if (!this.categoryId) {
      return;
    }

    const tagDto = {
      name: tagName,
      categoryId: this.categoryId
    };

    this.tagsService.createTag(tagDto).subscribe({
      next: () => {
        this.newTagName?.reset();
        this.loadExistingTags(this.categoryId!);
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  onDeleteTag(tagId: UUIDTypes, tagName: string): void {
    if (!this.categoryId) {
      return;
    }

    this.confirmationService.confirmDanger(
      'Delete tag',
      `Are you sure you want to delete the tag "${tagName}"? This action is irreversible.`
    ).subscribe(confirmed => {
      if (!confirmed) return;
      
      this.tagsService.deleteTag(tagId).subscribe({
        next: () => {
          this.loadExistingTags(this.categoryId!);
        },
        error: () => {
          // Error already handled in service
        }
      });
    });
  }

  get tags(): FormArray {
    return this.categoryForm.get('tags') as FormArray;
  }
}