import { Injectable } from '@angular/core';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';

@Injectable()
export class AddFeeDetailService {

  constructor(
    private http: PaybubbleHttpClient
  ) {}

  sendPayDetailsToPayhub(payModel: PaymentModel): Observable<any> {
    return this.http.post('/api/send-to-payhub', payModel);
  }
}
