import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appNineDigits]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NineDigits,
      multi: true,
    }
  ]
})
export class NineDigits implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const valid = RegExp('^[0-9]{9}$', 'i').test(control.value);
      return valid ? null : { NineDigits: true };
    }
    return null;
  }
}
