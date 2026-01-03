import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^(?=.*[a-zA-Z]).+$').test(control.value);
      return valid ? null : { UsernameValidator: true };
    }
    return null;
  };
}
