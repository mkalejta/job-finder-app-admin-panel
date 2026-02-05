import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$').test(String(control.value));

      return valid ? null : { PasswordValidator: true };
    }

    return null;
  };
}
