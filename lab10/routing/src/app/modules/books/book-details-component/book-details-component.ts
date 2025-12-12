import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { Book } from '../../../interfaces/Book';
import { BooksService } from '../books-service';

@Component({
  selector: 'app-book-details-component',
  imports: [RouterOutlet],
  templateUrl: './book-details-component.html',
  styleUrl: './book-details-component.scss',
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  books: Book[] | [] = [];

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.books = this.booksService.getBooks();
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.book = this.books.find((book) => book.id === +id);
    });
  }

  goBack(): void {
    this.router.navigate(['books']);
  }

  nextBook(): void {
    if (!this.book) return;
    if (this.book.id === this.books.length) return;
    this.router.navigate(['books', this.book!.id + 1, 'details']);
  }

  previousBook(): void {
    if (!this.book) return;
    if (this.book.id === 1) return;
    this.router.navigate(['books', this.book!.id - 1, 'details']);
  }

  isFirstBook(): boolean {
    return !this.book || this.book.id === 1;
  }

  isLastBook(): boolean {
    return !this.book || this.book.id === this.books.length;
  }
}
