import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { timeout, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentGroupService {
  constructor(
    private http: HttpClient
  ) {}

  getPaymentGroupByReference(reference: string): Observable<any> {
    return this.http.get<any>(`/payment-group/${reference}`)
      .pipe(
        timeout(30000),
        catchError(error => {
          console.log(error);
          return throwError('Sorry, there was a problem getting payment group');
        })
      );
  }
}
