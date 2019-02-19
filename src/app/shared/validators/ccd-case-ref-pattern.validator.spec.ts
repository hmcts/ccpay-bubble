import { ccdCaseRefPatternValidator } from './index';
import { FormControl } from '@angular/forms';

const validator = ccdCaseRefPatternValidator();

describe('String length validator', () => {
  it('Should strip dashes and return null on a case ref with dashes', () => {
    expect(validator(new FormControl('1111-2222-3333-4444'))).toBe(null);
  });

  it('Should return null on a cash ref with no dashes', () => {
    expect(validator(new FormControl('1111222233334444'))).toBe(null);
  });

  it('Shoud return an error if ccd case ref is too long', () => {
    expect(validator(new FormControl('111122223333444455555'))).toEqual({ 'ccdRefLength': true });
  });

  it('Should return an error if ccd case ref is too short', () => {
    expect(validator(new FormControl('111122223333'))).toEqual({ 'ccdRefLength': true });
  });

  it('Should return an error if ccd case ref is incorrectly formatted', () => {
    expect(validator(new FormControl('1111-2222-33334444'))).toEqual({ 'ccdRefLength': true });
  });
});
