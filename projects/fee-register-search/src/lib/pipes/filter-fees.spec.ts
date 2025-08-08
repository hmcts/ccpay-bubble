import { FilterFeesPipe } from './filter-fees.pipe';
import { mockFees } from '../mocks/mock-fees';
import { Jurisdictions } from '../models/Jurisdictions';

describe('Filter fees pipe', () => {
  const filterFeesPipe = new FilterFeesPipe();

  it('Should detect whether a value is a string', () => {
    expect(filterFeesPipe.isNumeric('test string')).toBeFalsy();
  });

  it('Should detect when a value is a number', () => {
    expect(filterFeesPipe.isNumeric('123')).toBeTruthy();
  });

  it('Should filter an array of fees on description', () => {
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    const results = filterFeesPipe.filterByDescription(validFees, 'test');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(validFees[1]);

    const results2 = filterFeesPipe.filterByDescription(validFees, 'civil money');
    expect(results2.length).toBe(1);
    expect(results2[0]).toEqual(validFees[0]);

    const results3 = filterFeesPipe.filterByDescription(validFees, 'test civil money');
    expect(results3.length).toBe(2);
    expect(results3[0]).toEqual(validFees[0]);
  });

  it('Should filter an array of valid fees', () => {
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    expect(mockFees.length).toBe(3);
    expect(validFees.length).toBe(2);
  });

  it('Should filter an array of fees on amount', () => {
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    const results = filterFeesPipe.filterByAmount(validFees, '10000');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[0]);
  });

  it('Should filter an array of fees on amount and description when it is a number also sort by amount first', () => {
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    const results = filterFeesPipe.filterByNumber(validFees, '500');
    expect(results.length).toBe(2);
    expect(results[0]).toEqual(mockFees[1]);
  });

  it('Should filter an array of fees on jurisdiction tribunal to be empty', () => {
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    const jurisdiction = new Jurisdictions();
    jurisdiction.jurisdiction1 = 'tribunal';
    jurisdiction.jurisdiction2 = 'test';
    const results = filterFeesPipe.filterByJurisdictions(validFees, jurisdiction);
    expect(results.length).toBe(0);
  });

  it('Should filter an array of fees on jurisdiction civil', () => {
    const jurisdiction = new Jurisdictions();
    jurisdiction.jurisdiction1 = 'civil';
    jurisdiction.jurisdiction2 = '';
    const results = filterFeesPipe.filterByJurisdictions(mockFees, jurisdiction);
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
    const validFees = filterFeesPipe.filterValidFee(mockFees);
    const results = filterFeesPipe.filterByFeeCode(validFees, 'fee0001');
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(mockFees[0]);
  });

  it('Should check if certain word is conjunction or not', () => {
    expect(filterFeesPipe.isConjunction('application')).toBeFalsy();
    expect(filterFeesPipe.isConjunction('divorce')).toBeFalsy();
    expect(filterFeesPipe.isConjunction('or')).toBeTruthy();
    expect(filterFeesPipe.isConjunction('and')).toBeTruthy();
  });

  it('Should include fee if valid_from is in the past and valid_to is in the future', () => {
    const now = new Date();
    const fee = {
      current_version: {
        status: 'approved',
        valid_from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
        valid_to: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),   // tomorrow
      }
    };
    const result = filterFeesPipe.filterValidFee([fee as any]);
    expect(result.length).toBe(1);
  });

  it('Should exclude fee if valid_from is in the future', () => {
    const now = new Date();
    const fee = {
      current_version: {
        status: 'approved',
        valid_from: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        valid_to: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),   // day after tomorrow
      }
    };
    const result = filterFeesPipe.filterValidFee([fee as any]);
    expect(result.length).toBe(0);
  });

  it('Should include fee if valid_to is null (no end date) and valid_from is in the past', () => {
    const now = new Date();
    const fee = {
      current_version: {
        status: 'approved',
        valid_from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
        valid_to: null,
      }
    };
    const result = filterFeesPipe.filterValidFee([fee as any]);
    expect(result.length).toBe(1);
  });

  it('Should exclude fee if valid_to is in the past', () => {
    const now = new Date();
    const fee = {
      current_version: {
        status: 'approved',
        valid_from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        valid_to: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),      // yesterday
      }
    };
    const result = filterFeesPipe.filterValidFee([fee as any]);
    expect(result.length).toBe(0);
  });
});
