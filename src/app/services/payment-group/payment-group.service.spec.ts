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

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    expect(paymentModel.amount).toBe(100);
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.ccd_case_number = '1111222233334444';
    expect(paymentModel.ccd_case_number).toBe('1111222233334444');
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.currency = 'GBP';
    expect(paymentModel.currency).toBe('GBP');
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.description = 'test';
    expect(paymentModel.description).toBe('test');
  });

  it('Should call post full remission with a remissionModel', () => {
    const paymentGroup = <IPaymentGroup>{
        payment_group_reference: '1234',
        fees: [{code: 'FEE0001'}],
        payments: null,
        remissions: null
    };
    spyOn(http, 'post').and.callFake((param1: string, param2: IPaymentGroup) => of(paymentGroup));
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

  it('Should call put Payment Group', () => {
    const paymentGroup = <IPaymentGroup>{
        payment_group_reference: '1234',
        fees: [{code: 'FEE0001'}],
        payments: null,
        remissions: null
    };
    spyOn(http, 'put').and.callFake((param1: string, param2: IPaymentGroup) => of(paymentGroup));
    const inputPaymentGroup = <IPaymentGroup>{
      payment_group_reference: null,
      fees: [{ccd_case_number: '1234', code: 'FEE0001'}],
      payments: null,
      remissions: null
    };
    paymentGroupService.putPaymentGroup('1234', inputPaymentGroup)
      .then((response) => {
        expect(response.fees[0].code).toBe(paymentGroup.fees[0].code);
        expect(response.payment_group_reference).toBe(paymentGroup.payment_group_reference);
      });
  });

    it('Should call get bulk scanning Payment details', () => {
    const paymentGroup = <any>{
        ccd_reference: '1111222233334444',
        exception_record_reference: '1111222233334444',
        payments: [
          {
            amount: 100,
            bgc_reference: 'BGC1203',
            case_reference: '1111222233334444',
            currency: 'GBP',
            date_banked: '2019-DEC-02',
            date_created: '2019-DEC-19',
            date_updated: '2019-DEC-30',
            dcn_case: '11112222333344440',
            dcn_reference: '11112222333344440',
            first_cheque_dcn_in_batch: 'string',
            outbound_batch_number: 'string',
            payer_name: 'tester',
            payment_method: 'CHEQUE',
            po_box: 'string'
          }
        ],
        responsible_service_id: 'AA07'
    };
    spyOn(http, 'get').and.callFake((param1: string) => of(paymentGroup));
    paymentGroupService.getBSPaymentsByDCN('1234')
      .then((response) => {
        expect(response.ccd_reference).toBe(paymentGroup.ccd_reference);
        expect(response.exception_record_reference).toBe(paymentGroup.exception_record_reference);
      }).catch(() => {

      });
  });
});
