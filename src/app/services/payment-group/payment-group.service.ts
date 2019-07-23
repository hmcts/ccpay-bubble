import {Injectable} from '@angular/core';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PaymentGroupService {

  constructor(
    private http: HttpClient
  ) {
  }

  postPaymentGroup(paymentGroup: IPaymentGroup): Promise<IPaymentGroup> {
    return this.http.post('api/payment-groups', paymentGroup).toPromise().then(paymentGroupJson => {
      return <IPaymentGroup> paymentGroupJson;
    });
  }
}
