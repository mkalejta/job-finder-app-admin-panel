import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appYearBetween]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: YearBetween,
      multi: true,
    }
  ]
})
export class YearBetween implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const today = new Date().getFullYear();
      const year = Number(control.value);
      if (isNaN(year)) {
        return { YearNotBetween: true };
      }
      const valid = year >= today - 100 && year <= today;
      return valid ? null : { YearNotBetween: true };
    }
    return null;
  }
}
