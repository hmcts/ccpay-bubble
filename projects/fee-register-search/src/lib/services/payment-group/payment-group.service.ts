import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentGroupService {

  private _API_URL: string;

  constructor(
    private http: HttpClient
  ) {}

  setURL(url: string) {
    this._API_URL = url;
  }

  getPaymentGroupByReference(reference: string): Observable<any> {
    return this.http.get<any>(`${this._API_URL}/${reference}`)
      .pipe(
        timeout(30000),
        catchError(error => {
          return throwError('Sorry, there was a problem getting payment group');
        })
      );
  }
}
