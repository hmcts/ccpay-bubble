import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IFee } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FeeRegisterSearchService {
  private _API_URL: string;

  constructor(
    private http: HttpClient
  ) {}

  setURL(url: string) {
    this._API_URL = url;
  }

  getFees(): Observable<any> {
    return this.http.get<IFee[]>(`${this._API_URL}/fees`)
      .pipe(
        timeout(30000),
        catchError(error => {
          return throwError('Sorry, there was a problem getting fees');
        })
      );
  }

  getJurisdiction(jurisdictionNo: number): Observable<any> {
    return this.http.get<any>(`${this._API_URL}/fees-jurisdictions/${jurisdictionNo}`)
      .pipe(
        timeout(30000),
        catchError(error => {
          console.log(error);
          return throwError('Sorry, there was a problem getting fees');
        })
      );
  }
}
