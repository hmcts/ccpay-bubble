import { Injectable } from '@angular/core';
import {PaybubbleHttpClient} from '../httpclient/paybubble.http.client';

@Injectable()
export class IdamDetails {
  constructor(
    private http: PaybubbleHttpClient,
  ) { }

  getUserDetails() {
    return this.http.get('/api/details').toPromise();
  }
}