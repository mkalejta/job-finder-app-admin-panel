import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appFirstLetterBig]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FirstLetterBig,
      multi: true,
    }
  ]
})
export class FirstLetterBig implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const valid = new RegExp('^[A-Z]$', 'i').test(control.value[0]);
      return valid ? null : { FirstLetterBig: true };
    }
    return null;
  }

}
