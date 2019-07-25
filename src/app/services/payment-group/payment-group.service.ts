import {Injectable} from '@angular/core';
import {PaybubbleHttpClient} from '../httpclient/paybubble.http.client';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

@Injectable()
export class PaymentGroupService {

  constructor(
    private http: PaybubbleHttpClient
  ) {
  }

  postPaymentGroup(paymentGroup: any): Promise<IPaymentGroup> {
    return this.http.post('api/payment-groups', paymentGroup).toPromise().then(paymentGroupJson => {
      return <IPaymentGroup>paymentGroupJson;
    });
  }
}
