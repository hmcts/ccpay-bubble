import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { IFee } from './interfaces';

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
    return this.http.get<IFee>(this._API_URL)
      .pipe(
        timeout(5000),
        catchError(error => {
          return throwError('Sorry, there was a problem getting fees');
        })
      );
  }
}
