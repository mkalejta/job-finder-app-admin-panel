import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { UUIDTypes } from 'uuid';
import CategoryCreateDto from '../../../interface/category/CategoryCreateDto';
import { Location } from '@angular/common';
import Category from '../../../interface/category/Category';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { CommonModule } from '@angular/common';
import { categoryAndTagValidator } from '../../../shared/validators/category-and-tag.validator';

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
        }
      }
    });
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, categoryAndTagValidator()]],
      categoryColor: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoryForm.value;
    const categoryValues: CategoryCreateDto = {
      name: formValue.name,
      color: formValue.categoryColor
    };

    if (this.isEditMode && this.categoryId && this.category) {
      this.categoryService.updateCategory(categoryValues, this.categoryId);
    } else {
      this.categoryService.createCategory(categoryValues);
    }

    this.router.navigate(['categories']);
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
}
