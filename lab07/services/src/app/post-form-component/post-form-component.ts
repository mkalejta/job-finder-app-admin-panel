import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-post-form-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-form-component.html',
  styleUrls: ['./post-form-component.scss'],
})
export class PostFormComponent implements OnInit, OnChanges {
  @Input() editing: Post | null = null;
  @Output() save = new EventEmitter<Post>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      content: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if (this.editing) {
      this.userForm.setValue({
        title: this.editing.title,
        content: this.editing.content,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing']) {
      const current = changes['editing'].currentValue as typeof this.editing;
      if (current) {
        this.userForm.patchValue({
          title: current.title ?? '',
          content: current.content ?? '',
        });
      } else {
        this.userForm.reset();
      }
    }
  }

  resetTitle(): void {
    this.userForm.get('title')?.reset();
  }

  resetForm(): void {
    this.userForm.reset();
    this.editing = null;
  }

  submitForm(): void {
    if (this.userForm.invalid) return;
    const val = this.userForm.value;
    const now = new Date().toISOString();
    const post: Post = this.editing
      ? {
          id: this.editing.id,
          title: val.title,
          content: val.content,
          createdAt: this.editing.createdAt,
          modifiedAt: now,
        }
      : {
          id: '',
          title: val.title,
          content: val.content,
          createdAt: now,
          modifiedAt: now,
        };
    this.save.emit(post);
    this.resetForm();
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }
}
