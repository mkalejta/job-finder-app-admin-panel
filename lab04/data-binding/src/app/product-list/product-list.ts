import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  @Input() products: Array<string> = [];

  newProduct: string = '';

  addProduct(): void {
    
    this.products.push(this.newProduct);
    this.newProduct = '';
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
  }
}
