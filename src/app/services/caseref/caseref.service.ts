import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from '../httpclient/paybubble.http.client';

@Injectable()
export class CaseRefService {

  constructor(
    private http: PaybubbleHttpClient
  ) {}

  validateCaseRef(ccdCaseNumber: string): Observable<any> {
    return this.http.get(`/api/cases/${ccdCaseNumber}`);
  }
}
