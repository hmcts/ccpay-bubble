import { of, Observable } from 'rxjs';
import { mockFees } from './mock-fees';

export class MockFeeRegisterSearchService {
  getFees(): Observable<any> {
    return of(mockFees);
  }

  getJurisdiction(jurisdictionNo: number): Observable<any> {
    return of([{name: 'civil'}, {name: 'family'}, {name: 'tribunal'}]);
  }
}
