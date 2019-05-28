import { FilterFeesPipe } from './filter-fees.pipe';
import { mockFees } from '../mock-fees';

describe('Filter fees pipe', () => {
  const filterFeesPipe = new FilterFeesPipe();

  it('Should detect whether a value is a string', () => {
    expect(filterFeesPipe.isNumeric('test string')).toBeFalsy();
  });

  it('Should detect when a value is a number', () => {
    expect(filterFeesPipe.isNumeric('123')).toBeTruthy();
  });

  it('Should filter an array of fees on description', () => {
    const results = filterFeesPipe.filterByDescription(mockFees, 'test');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[1]);

    const results2 = filterFeesPipe.filterByDescription(mockFees, 'civil money');
    expect(results2.length).toBe(1);
    expect(results2[0]).toEqual(mockFees[0]);

    const results3 = filterFeesPipe.filterByDescription(mockFees, 'test civil money');
    expect(results3.length).toBe(2);
    expect(results3[0]).toEqual(mockFees[0]);
  });

  it('Should filter an array of fees on amount', () => {
    const results = filterFeesPipe.filterByAmount(mockFees, '10000');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[0]);
  });

  it('Should filter an array of fees on jurisdiction tribunal to be empty', () => {
    const results = filterFeesPipe.filterByJurisdictions(mockFees, ['tribunal']);
    expect(results.length).toBe(0);
  });

  it('Should filter an array of fees on jurisdiction civil', () => {
    const results = filterFeesPipe.filterByJurisdictions(mockFees, ['civil']);
    expect(results.length).toBe(2);
    expect(results[0]).toEqual(mockFees[0]);
  });

  it('Should detect when a value is of a feecode', () => {
    expect(filterFeesPipe.isFeeCode('FEE0002')).toBeTruthy();
  });

  it('Should detect when a value is not a feecode', () => {
    expect(filterFeesPipe.isFeeCode('test')).toBeFalsy();
  });

  it('Should detech a search on feecode regardless of casing', () => {
    expect(filterFeesPipe.isFeeCode('FeE0003')).toBeTruthy();
  });

  it('Should filter an array of fees on fee code', () => {
    const results = filterFeesPipe.filterByFeeCode(mockFees, 'fee0001');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[0]);
  });
});
