import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { timeout } from 'rxjs/internal/operators/timeout';

@Injectable({
  providedIn: 'root'
})
export class ViewPaymentService {

  constructor(
    private http: HttpClient,
  ) { }

  getPaymentDetail(paymentRef: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/payments/${paymentRef}`).pipe(
      timeout(2500),
      catchError(error => {
        return throwError('Sorry there is a problem with the service');
      })
    );
  }
}
