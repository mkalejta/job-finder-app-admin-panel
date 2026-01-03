import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function categoryAndTagValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^[A-Z]+[a-z]+$').test(control.value);
      return valid ? null : { CategoryAndTagValidator: true };
    }
    return null;
  };
}
