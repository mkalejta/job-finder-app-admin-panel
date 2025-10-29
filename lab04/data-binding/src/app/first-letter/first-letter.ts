import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appFirstLetter]',
  providers: [
    { provide: NG_VALIDATORS,
      useExisting: FirstLetter,
      multi: true,
    }
  ]
})
export class FirstLetter implements Validator{
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const valid = new RegExp('[A-Za-z]', 'i').test(control.value[0]);
      return valid ? null : { notFirstLetter: true };
    }

    return null;
  }

  // registerOnValidatorChange(fn: () => void): void {
  //   throw new Error('afkakfa');
  // }
}
