import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^[0-9]+$').test(String(control.value));

      return valid ? null : { PhoneNumberValidator: true };
    }

    return null;
  };
}
