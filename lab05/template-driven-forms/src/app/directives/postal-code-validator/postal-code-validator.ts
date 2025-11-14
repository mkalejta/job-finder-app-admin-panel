import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPostalCodeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PostalCodeValidator,
      multi: true,
    }
  ]
})
export class PostalCodeValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const valid = RegExp('^\d{2}-\d{3}$').test(control.value);
      return valid ? null : { appPostalCodeValidator: true };
    }
    return null;
  }
}
