import { isLessThanAmountValidator } from './index';
import { FormControl } from '@angular/forms';
const validator = isLessThanAmountValidator(30);

describe('Less than amount validator', () => {
  it('Should return null if a value is null', () => {
    expect(validator(new FormControl(null))).toBe(null);
  });

  it('Should return null if a value is less than amount', () => {
    expect(validator(new FormControl(10))).toBe(null);
  });

  it('Should return a validation object if value is not null and greater than amount', () => {
    expect(validator(new FormControl(60))).toEqual({'amountGreaterThanFee': true });
  });
});
