import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../../interfaces/Book';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../books-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form-component.html',
  styleUrl: './book-form-component.scss',
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  book?: Book;
  isEditMode = false;
  bookId?: number;

  constructor (
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.bookId = +id;
        const books = this.booksService.getBooks();
        this.book = books.find((book) => book.id === +id);
        
        if (this.book) {
          this.bookForm.patchValue({
            title: this.book.title,
            author: this.book.author
          });
        }
      }
    });
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookForm.value;

    if (this.isEditMode && this.bookId) {
      const updatedBook: Book = {
        id: this.bookId,
        title: formValue.title,
        author: formValue.author
      };
      this.booksService.updateBook(updatedBook);
    } else {
      const newBook: Book = {
        id: this.booksService.getNextId(),
        title: formValue.title,
        author: formValue.author
      };
      this.booksService.addBook(newBook);
    }

    this.router.navigate(['books']);
  }

  goBack(): void {
    this.location.back();
  }

  get title() {
    return this.bookForm.get('title');
  }

  get author() {
    return this.bookForm.get('author');
  }
}
