import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  @Input() products: Array<string> = [];
  boughtProducts: Set<number> = new Set<number>();

  newProduct: string = '';

  addProduct(): void {
    this.products.push(this.newProduct);
    this.newProduct = '';
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
  }
  deleteBought(): void {
    const indices = Array.from(this.boughtProducts).filter(i => i >= 0 && i < this.products.length).sort((a, b) => b - a);
    for (const idx of indices) {
      this.products.splice(idx, 1);
    }
    this.boughtProducts.clear();
  }

  toggleBought(index: number, checked: boolean): void {
    if (checked) {
      this.boughtProducts.add(index);
    } else {
      this.boughtProducts.delete(index);
    }
  }
}
