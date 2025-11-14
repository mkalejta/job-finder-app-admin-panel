import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appLettersOnly]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LettersOnly,
      multi: true,
    }
  ]
})
export class LettersOnly implements Validator{
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const valid = new RegExp('^[A-Za-z]*$', 'i').test(control.value);
      return valid ? null : { lettersOnly: true };
    }
    return null;
  }
}
