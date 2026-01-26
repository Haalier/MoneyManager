import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    var rgx = /^[0-9]*\.?[0-9]*$/;

    return rgx.test(control.value) ? null : { invalidNumber: true };
  };
}
