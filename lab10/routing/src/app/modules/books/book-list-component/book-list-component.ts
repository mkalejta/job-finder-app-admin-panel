import { Component, OnInit, signal } from '@angular/core';
import { Book } from '../../../interfaces/Book';
import { BooksService } from '../books-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-list-component',
  imports: [],
  templateUrl: './book-list-component.html',
  styleUrl: './book-list-component.scss',
})
export class BookListComponent implements OnInit {
  books = signal<Book[] | []>([]);

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.booksService.books$.subscribe((books: Book[] | []) => {
      this.books.set(books);
    });
  }

  goToBookDetails(bookId: number): void {
    this.router.navigate([bookId, 'details'], { relativeTo: this.route });
  }

  goToBookForm(book: Book): void {
    this.router.navigate([book.id, "form"], { relativeTo: this.route });
  }
  
  deleteBook(bookId: number): void {
    const updatedBooks = this.books().filter(book => book.id !== bookId);
    this.booksService.setBooks(updatedBooks);
  }

  goToAddBook(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }
}
