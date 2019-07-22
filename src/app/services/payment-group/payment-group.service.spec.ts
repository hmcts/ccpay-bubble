import {PaybubbleHttpClient} from 'src/app/services/httpclient/paybubble.http.client';
import {Meta} from '@angular/platform-browser';
import {instance, mock} from 'ts-mockito/lib/ts-mockito';
import {HttpClient} from '@angular/common/http';
import {AddFeeDetailService} from 'src/app/services/add-fee-detail/add-fee-detail.service';
import {of} from 'rxjs';
import {PaymentModel} from 'src/app/models/PaymentModel';
import {RemissionModel} from 'src/app/models/RemissionModel';
import {FeeModel} from 'src/app/models/FeeModel';
import {feeTypes} from 'src/stubs/feeTypes';
import {PaymentGroupService} from './payment-group.service';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

describe('Payment group service', () => {
  let paymentGroupService: PaymentGroupService;
  let http: PaybubbleHttpClient;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentGroupService = new PaymentGroupService(http);
  });

  it('Should call post full remission with a remissionModel', () => {
    const paymentGroup = <IPaymentGroup>{
      payment_group_reference: '1234',
      fees: [{code: 'FEE0001'}],
      payments: null,
      remissions: null
    };
    spyOn(http, 'post').and.callFake((param1: string, param2: IPaymentGroup) => of(JSON.stringify(paymentGroup)));
    const inputPaymentGroup = <IPaymentGroup>{
      payment_group_reference: null,
      fees: [{ccd_case_number: '1234', code: 'FEE0001'}],
      payments: null,
      remissions: null
    };
    paymentGroupService.postPaymentGroup(inputPaymentGroup)
      .then((response) => {
        expect(response.fees[0].code).toBe(paymentGroup.fees[0].code);
        expect(response.payment_group_reference).toBe(paymentGroup.payment_group_reference);
      });
  });
});
