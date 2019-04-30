import { FilterFeesPipe } from './filter-fees.pipe';
import { mockFees } from '../mock-fees';

describe('Filter fees pipe', () => {
  const filterFeesPipe = new FilterFeesPipe();

  it('Should detect whether a value is a string', () => {
    expect(filterFeesPipe.isNumeric('test string')).toBeFalsy();
  });

  it('Should detech when a value is a number', () => {
    expect(filterFeesPipe.isNumeric('123')).toBeTruthy();
  });

  it('Should filter an array of fees on description', () => {
    const results = filterFeesPipe.filterByDescription(mockFees, 'test');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[1]);
  });

  it('Should filter an array of fees on amount', () => {
    const results = filterFeesPipe.filterByAmount(mockFees, '10000');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[0]);
  });

  it('Should filter an array of fees on jurisdiction tribunal to be empty', () => {
    const results = filterFeesPipe.filterByJurisdiction(mockFees, ['tribunal']);
    expect(results.length).toBe(0);
  });

  it('Should filter an array of fees on jurisdiction civil', () => {
    const results = filterFeesPipe.filterByJurisdiction(mockFees, ['civil']);
    expect(results.length).toBe(2);
    expect(results[0]).toEqual(mockFees[0]);
  });

});
