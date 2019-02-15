import { AbstractControl } from '@angular/forms';

export const helpWithFeesValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  const codeControl = control.get('code'),
    amountControl = control.get('amount');
  console.log('hwf code', codeControl.value);
  console.log('hwf amount', amountControl.value);

  if (!codeControl.value && amountControl.value !== null) {
    console.log('hwfcodeInvalid');
    return { 'hwfCodeInvalid' : true };
  } else if (codeControl.value && amountControl.value == null) {
    console.log('hwfAmountInvalid');
    return { 'hwfAmountInvalid' : true };
  } else if (amountControl.value < 0) {
    return { 'hwfAmountNegative' : true };
  } else {
    return null;
  }
};
