import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FirstLetter } from "../first-letter/first-letter";

@Component({
  selector: 'app-form',
  imports: [FormsModule, FirstLetter],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  firstName: string = '';
  lastName: string = '';
  address = {
    city: '',
    street: ''
  };

  onSubmit(form: NgForm): void {
    
    console.log(form.controls['firstName']);
  }
}
