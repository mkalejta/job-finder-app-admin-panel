import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appAlreadyExists]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlreadyExists,
      multi: true
    }
  ]
})
export class AlreadyExists implements Validator{
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      
    }

    return null;
  }
}
