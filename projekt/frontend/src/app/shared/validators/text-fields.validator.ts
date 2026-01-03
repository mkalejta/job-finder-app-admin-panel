import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function textFieldsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const valid = new RegExp('^(?=.*[a-zA-Z])[^@]+$').test(control.value);
      return valid ? null : { TextFieldsValidator: true };
    }
    return null;
  };
}
