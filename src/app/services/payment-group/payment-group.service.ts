import {Injectable} from '@angular/core';
import {PaybubbleHttpClient} from 'src/app/services/httpclient/paybubble.http.client';
import {FeeModel} from 'src/app/models/FeeModel';
import {Observable} from 'rxjs';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

@Injectable()
export class PaymentGroupService {
  constructor(
    private http: PaybubbleHttpClient
  ) {
  }

  postPaymentGroup(fee: FeeModel): Promise<IPaymentGroup> {
    return this.http.post('http://localhost:9999/api/payment-groups', fee).toPromise().then(paymentGroupJson => {
      return JSON.parse(paymentGroupJson);
    });
    // return this.http.post('api/payment-groups', fee).toPromise();
  }
}
