import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IFee } from './interfaces';
import { JurisdictionData } from './models/Jurisdictions';

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
    return this.http.get<IFee[]>(this._API_URL)
      .pipe(
        timeout(30000),
        catchError(error => {
          return throwError('Sorry, there was a problem getting fees');
        })
      );
  }

  getJurisdiction(jurisdictionNo: number): Observable<any> {
    return this.http.get<any>(`/api/fees-jurisdictions/${jurisdictionNo}`)
      .pipe(
        timeout(30000),
        catchError(error => {
          console.log(error);
          return throwError('Sorry, there was a problem getting fees');
        })
      );
  }
}
