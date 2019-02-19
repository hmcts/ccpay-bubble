import { AbstractControl } from '@angular/forms';

export const helpWithFeesValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  const codeControl = control.get('code'),
    amountControl = control.get('amount');

  if (!codeControl.value && amountControl.value !== null) {
    return { 'hwfCodeInvalid' : true };
  } else if (codeControl.value && amountControl.value == null) {
    return { 'hwfAmountInvalid' : true };
  } else if (amountControl.value < 0) {
    return { 'hwfAmountNegative' : true };
  } else if (!codeControl.value.match(/^HWF\-[A-Z0-9]{3}\-[A-Z0-9]{3}$/i)) {
    return { 'hwfCodeFormatInvalid': true };
  } else {
    return null;
  }
};
