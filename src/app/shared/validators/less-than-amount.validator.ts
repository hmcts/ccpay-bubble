import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

export const isLessThanAmountValidator = (amount: number): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value <= amount || control.value === null) {
      return null;
    }
    return { 'amountGreaterThanFee': true };
  };
};
