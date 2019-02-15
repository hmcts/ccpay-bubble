import { AbstractControl, ValidatorFn } from '@angular/forms';

export const stringLengthValidator = (maxLength: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const strippedControl = control.value.replace(/\-/g, '').trim();
    const controlLength = strippedControl.length;
    if (controlLength === maxLength) {
      return null;
    }
    return { 'ccdRefLength': true };
  };
};
