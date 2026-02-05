import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$').test(String(control.value));

      return valid ? null : { EmailValidator: true };
    }

    return null;
  };
}
