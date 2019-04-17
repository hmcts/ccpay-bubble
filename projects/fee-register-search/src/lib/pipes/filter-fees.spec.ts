import { FilterFeesPipe } from './filter-fees.pipe';
import { filter } from 'rxjs/internal/operators/filter';

describe('Filter fees pipe', () => {
  const filterFeesPipe = new FilterFeesPipe();

  it('Should detect whether a value is a number', () => {
    expect(filterFeesPipe.isNumeric('test string')).toBeFalsy();
  });

  it('Should detech when a value is a string', () => {
    expect(filterFeesPipe.isNumeric(123)).toBeTruthy();
  });

  it('Should filter an array of fees on description', () => {

  });

  it('Should filter an array of fees on amount', () => {

  });
});
