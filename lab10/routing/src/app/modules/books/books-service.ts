import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../../interfaces/Book';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private books = new BehaviorSubject<Book[] | []>(localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')!) : []);
  books$: Observable<Book[] | []> = this.books.asObservable();

  setBooks(books: Book[] | []): void {
    this.books.next(books);
    localStorage.setItem('books', JSON.stringify(books));
  }

  getBooks(): Book[] | [] {
    return this.books.value;
  }

  addBook(book: Book): void {
    const currentBooks = this.books.value;
    this.books.next([...currentBooks, book]);
    localStorage.setItem('books', JSON.stringify(this.books.value));
  }

  updateBook(updatedBook: Book): void {
    const currentBooks = this.books.value;
    const index = currentBooks.findIndex(book => book.id === updatedBook.id);
    
    if (index !== -1) {
      const updatedBooks = [...currentBooks];
      updatedBooks[index] = updatedBook;
      this.books.next(updatedBooks);
    }
    localStorage.setItem('books', JSON.stringify(this.books.value));
  }

  deleteBook(bookId: number): void {
    const currentBooks = this.books.value;
    const filteredBooks = currentBooks.filter(book => book.id !== bookId);
    this.books.next(filteredBooks);
    localStorage.setItem('books', JSON.stringify(this.books.value));
  }

  getNextId(): number {
    const currentBooks = this.books.value;
    if (currentBooks.length === 0) return 1;
    const maxId = Math.max(...currentBooks.map(book => book.id));
    return maxId + 1;
  }
}
