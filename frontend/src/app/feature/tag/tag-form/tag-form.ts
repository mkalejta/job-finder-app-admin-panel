import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TagsService } from '../tag.service';
import { UUIDTypes } from 'uuid';
import { TagCreateDto } from '../../../interface/tag/TagCreateDto';
import { Location } from '@angular/common';
import { Tag } from '../../../interface/tag/tag';
import { CategoryService } from '../../category/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { categoryAndTagValidator } from '../../../shared/validators/category-and-tag.validator';
import { NotificationService } from '../../../core/services/notification.service';
import { MatIconModule } from '@angular/material/icon';

interface TagFormGroup {
  name: FormControl<string | null>;
  categoryId: FormControl<UUIDTypes | null>;
}

@Component({
  selector: 'app-tag-form',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './tag-form.html',
  styleUrl: './tag-form.scss',
})
export class TagFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private tagsService = inject(TagsService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  public tagForm!: FormGroup<TagFormGroup>;
  public tag?: Tag;
  public categoryId?: UUIDTypes;
  public isEditMode = false;
  public tagId?: UUIDTypes;
  public categories = toSignal(this.categoryService.categories$, { initialValue: [] });

  public ngOnInit(): void {
    this.categoryService.loadCategories();
    this.initForm();

    this.route.params.subscribe((params: Params) => {
      const id = params['id'] as UUIDTypes | undefined;
      if (id) {
        this.isEditMode = true;
        this.tagId = id;
        const tags = this.tagsService.getTags();
        this.tag = tags.find((tag: Tag) => tag.id === id) as Tag;
        this.categoryId = this.categories().find((cat) => cat.name === this.tag?.categoryName)?.id;
        

        this.tagForm.patchValue({
          name: this.tag.name,
          categoryId: this.categoryId,
        });
      }
    });
  }

  public initForm(): void {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, categoryAndTagValidator()]],
      categoryId: ['', [Validators.required]],
    }) as FormGroup<TagFormGroup>;
  }

  public onSubmit(): void {
    if (this.tagForm.invalid) {
      this.tagForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');

      return;
    }

    const formValue = this.tagForm.value;
    const tagValues: TagCreateDto = {
      name: formValue.name!,
      categoryId: formValue.categoryId!
    };

    if (this.isEditMode && this.tagId && this.tag) {
      this.tagsService.updateTag(tagValues, this.tagId).subscribe({
        next: () => {
          this.router.navigate(['tags']);
        },
        error: () => {
          //Error already handled in service
        }
      });
    } else {
      this.tagsService.createTag(tagValues).subscribe({
        next: () => {
          this.router.navigate(['tags']);
        },
        error: () => {
          //Error already handled in service
        }
      });
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public get name(): FormControl<string | null> | null {
    return this.tagForm.get('name') as FormControl<string | null> | null;
  }

  public get categoryIdControl(): FormControl<UUIDTypes | null> | null {
    return this.tagForm.get('categoryId') as FormControl<UUIDTypes | null> | null;
  }
}
