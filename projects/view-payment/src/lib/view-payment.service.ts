import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewPaymentService {

  constructor(
    private http: HttpClient,
  ) { }

  getPaymentDetail(paymentRef: string): Observable<any> {
    return this.http.get(`api/payments/${paymentRef}`).pipe(
      timeout(30000),
      map((res: any) => res.data),
      catchError(error => {
        return throwError('Sorry there is a problem with the service');
      })
    );
  }
}
