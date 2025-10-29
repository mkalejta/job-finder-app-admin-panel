import { Component } from '@angular/core';
import { Value } from "./value/value";
import { Form } from './form/form';
import { ProductList } from "./product-list/product-list";

@Component({
  selector: 'app-root',
  imports: [Value, Form, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected value = 'Nowa';
}
