import { Component } from '@angular/core';
import { ProductList } from "./product-list/product-list";
import { ProductForm } from "./product-form/product-form";

@Component({
  selector: 'app-root',
  imports: [ProductList, ProductForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected value = 'Nowa';
  protected products: Array<string> = [];

  protected addProduct(product: string) {
    this.products = [...this.products, product];
  }
}
