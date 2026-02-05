import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { TagsService } from '../../tag/tag.service';
import { UUIDTypes } from 'uuid';
import { CategoryCreateDto } from '../../../interface/category/CategoryCreateDto';
import { Location, CommonModule } from '@angular/common';
import { categoryAndTagValidator } from '../../../shared/validators/category-and-tag.validator';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatIconModule } from '@angular/material/icon';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { Category } from '../../../interface/category/Category';
import { Tag } from '../../../interface/tag/Tag';

interface TagFormGroup {
  id: FormControl<UUIDTypes | null>;
  name: FormControl<string | null>;
}

interface CategoryFormGroup {
  name: FormControl<string | null>;
  categoryColor: FormControl<CategoryColor | null>;
  tags: FormArray<FormGroup<TagFormGroup>>;
  newTagName: FormControl<string | null>;
}

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private categoryService = inject(CategoryService);
  private tagsService = inject(TagsService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  
  public categoryForm!: FormGroup<CategoryFormGroup>;
  public category?: Category;
  public isEditMode = false;
  public categoryId?: UUIDTypes;
  public categoryColors = Object.values(CategoryColor);

  public ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      const id = params['id'] as UUIDTypes;
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
      next: (tags: Tag[]) => {
        const tagsArray = this.tags;
        tagsArray.clear();
        
        tags.forEach((tag: Tag) => {
          tagsArray.push(this.fb.group({
            id: [tag.id],
            name: [tag.name]
          }) as FormGroup<TagFormGroup>);
        });
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  public initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, categoryAndTagValidator()]],
      categoryColor: ['', [Validators.required]],
      tags: this.fb.array([]),
      newTagName: ['', [categoryAndTagValidator()]]
    }) as unknown as FormGroup<CategoryFormGroup>;
  }

  public onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');

      return;
    }

    const formValue = this.categoryForm.value;
    const categoryValues: CategoryCreateDto = {
      name: formValue.name!,
      color: formValue.categoryColor!
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

  public goBack(): void {
    this.location.back();
  }

  public get name(): FormControl<string | null> {
    return this.categoryForm.get('name') as FormControl<string | null>;
  }

  public get categoryColor(): FormControl<CategoryColor | null> {
    return this.categoryForm.get('categoryColor') as FormControl<CategoryColor | null>;
  }

  public get newTagName(): FormControl<string | null> {
    return this.categoryForm.get('newTagName') as FormControl<string | null>;
  }

  public onAddTag(): void {
    const tagName = this.newTagName.value?.trim();

    if (!tagName) {
      this.notificationService.warning('Please enter a tag name.');

      return;
    }

    if (this.newTagName.invalid) {
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
        this.newTagName.reset();
        this.loadExistingTags(this.categoryId!);
      },
      error: () => {
        // Error already handled in service
      }
    });
  }

  public onDeleteTag(tagId: UUIDTypes | null | undefined, tagName: string | null | undefined): void {
    if (!this.categoryId || !tagId || !tagName) {
      return;
    }

    this.confirmationService.confirmDanger(
      'Delete tag',
      `Are you sure you want to delete the tag "${tagName}"? This action is irreversible.`
    ).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      
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

  public get tags(): FormArray<FormGroup<TagFormGroup>> {
    return this.categoryForm.get('tags') as FormArray<FormGroup<TagFormGroup>>;
  }
}