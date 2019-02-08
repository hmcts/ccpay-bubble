import { Injectable } from '@angular/core';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { IResponse } from 'src/app/interfaces/response';

@Injectable()
export class AddFeeDetailService {

  constructor(
    private http: PaybubbleHttpClient
  ) {}

  sendPayDetailsToPayhub(payModel: PaymentModel) {
    return this.http.post('/api/send-to-payhub', payModel).toPromise();
  }
}
