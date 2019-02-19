import { AbstractControl, ValidatorFn } from '@angular/forms';

export const ccdCaseRefPatternValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const ccdPatternWithDashes = /^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/i;
    if (control.value.match(ccdPatternWithDashes) || control.value.match(/^[0-9]{16}$/)) {
      return null;
    }
    return { 'ccdRefLength': true };
  };
};
