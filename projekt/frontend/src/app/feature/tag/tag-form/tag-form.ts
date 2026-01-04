import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '../tag.service';
import { UUIDTypes } from 'uuid';
import TagCreateDto from '../../../interface/tag/TagCreateDto';
import { Location } from '@angular/common';
import Tag from '../../../interface/tag/Tag';
import { CategoryService } from '../../category/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { categoryAndTagValidator } from '../../../shared/validators/category-and-tag.validator';
import { NotificationService } from '../../../core/services/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-form',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './tag-form.html',
  styleUrl: './tag-form.scss',
})
export class TagForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private tagsService = inject(TagsService);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  tagForm!: FormGroup;
  tag?: Tag;
  categoryId?: UUIDTypes;
  isEditMode = false;
  tagId?: UUIDTypes;
  categories = toSignal(this.categoryService.categories$, { initialValue: [] });

  ngOnInit(): void {
    this.categoryService.loadCategories();
    this.initForm();

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.tagId = id;
        const tags = this.tagsService.getTags();
        this.tag = tags.find((tag) => tag.id === id);
        this.categoryId = this.categories().find((cat) => cat.name === this.tag?.categoryName)?.id;
        
        if (this.tag) {
          this.tagForm.patchValue({
            name: this.tag.name,
            categoryId: this.categoryId,
          });
        }
      }
    });
  }

  initForm(): void {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, categoryAndTagValidator()]],
      categoryId: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid) {
      this.tagForm.markAllAsTouched();
      this.notificationService.warning('Please fill out all required fields correctly.');
      return;
    }

    const formValue = this.tagForm.value;
    const tagValues: TagCreateDto = {
      name: formValue.name,
      categoryId: formValue.categoryId
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

  goBack(): void {
    this.location.back();
  }

  get name() {
    return this.tagForm.get('name');
  }

  get categorId() {
    return this.tagForm.get('categoryId');
  }
}
