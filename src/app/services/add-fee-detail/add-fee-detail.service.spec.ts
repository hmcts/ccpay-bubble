import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { Meta } from '@angular/platform-browser';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { of } from 'rxjs';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { FeeModel } from 'src/app/models/FeeModel';
import { feeTypes } from 'src/stubs/feeTypes';

describe('Add fee detail service', () => {
  let addFeeDetailService: AddFeeDetailService;
  let http: PaybubbleHttpClient;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailService = new AddFeeDetailService(http);
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    addFeeDetailService.paymentModel = paymentModel;
    expect(addFeeDetailService.paymentModel.amount).toBe(100);
  });

  it('Should SET and GET private payment model', () => {
    const remissionModel = new RemissionModel();
    remissionModel.hwf_amount = 100;
    addFeeDetailService.remissionModel = remissionModel;
    expect(addFeeDetailService.remissionModel.hwf_amount).toBe(100);
  });

  it('Should SET and GET selected fee', () => {
    const fee = new FeeModel();
    fee.calculated_amount = 100;
    addFeeDetailService.selectedFee = fee;
    expect(addFeeDetailService.selectedFee.calculated_amount).toBe(100);
  });

  it('Should SET and GET remission ref', () => {
    addFeeDetailService.remissionRef = 'HWF-123';
    expect(addFeeDetailService.remissionRef).toBe('HWF-123');
  });

  it('Should set a new payment model', () => {
    const fee = new FeeModel();
    fee.calculated_amount = 100;
    addFeeDetailService.selectedFee = fee;
    const props = {
      caseReference: '1111-2222-3333-4444',
      serviceType: 'DIVORCE',
    };
    addFeeDetailService.setNewPaymentModel(props);
    expect(addFeeDetailService.paymentModel.ccd_case_number).toBe('1111-2222-3333-4444');
    expect(addFeeDetailService.paymentModel.fees[0].calculated_amount).toBe(100);
    expect(addFeeDetailService.paymentModel.service).toBe('DIVORCE');
    expect(addFeeDetailService.paymentModel.amount).toBe(100);
  });

  it('Should set a new remission model', () => {
    const fee = new FeeModel();
    fee.calculated_amount = 100;
    addFeeDetailService.selectedFee = fee;
    const props = {
      amountToPay: 1,
      helpWithFeesCode: '123'
    };
    addFeeDetailService.setNewRemissionModel(props);
    expect(addFeeDetailService.remissionModel.fee.calculated_amount).toBe(100);
    expect(addFeeDetailService.remissionModel.hwf_amount).toBe(99);
    expect(addFeeDetailService.remissionModel.hwf_reference).toBe('123');
  });

  it('Should populate the fee list with fee data', () => {
    const feeList = addFeeDetailService.buildFeeList();
    expect(feeList.length).toBe(feeTypes.length);
  });

  it('Should add fee model versions when populating fee list', () => {
    const feeList = addFeeDetailService.buildFeeList();
    expect(feeList[0].calculated_amount).toBe(550.00);
    expect(feeList[0].display_amount).toBe('£ 550.00');
    expect(feeList[0].description).toBe('Filing an application for a divorce, nullity or civil partnership dissolution');
    expect(feeList[0].version).toBe('4');
  });

  it('Should add fee model code when populating fee list', () => {
    const feeList = addFeeDetailService.buildFeeList();
    expect(feeList[0].code).toBe('FEE0002');
  });

  it('Should call post payment with the correct path', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: PaymentModel) => of(param1));
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    addFeeDetailService.paymentModel = paymentModel;
    addFeeDetailService.postCardPayment()
    .then((response) => expect(response).toEqual('/api/card-payments'));
  });

  it('Should call post payment with a paymentModel', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: PaymentModel) => of(param2));
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    addFeeDetailService.paymentModel = paymentModel;
    addFeeDetailService.postCardPayment()
    .then((response) => expect(response.amount).toBe(100));
  });

  it('Should call post full remission with the correct path', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: RemissionModel) => of(param1));
    const remissionModel = new RemissionModel();
    remissionModel.hwf_amount = 100;
    addFeeDetailService.remissionModel = remissionModel;
    addFeeDetailService.postFullRemission()
    .then((response) => expect(response).toEqual('/api/remissions'));
  });

  it('Should call post partial remission with the correct path', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: RemissionModel) => of(param1));
    const remissionModel = new RemissionModel();
    remissionModel.hwf_amount = 100;
    addFeeDetailService.remissionModel = remissionModel;
    addFeeDetailService.postPartialRemission('paymentgroup', 'feeId')
    .then((response) => expect(response).toEqual('/api/payment-groups/paymentgroup/fees/feeId/remissions'));
  });

  it('Should call post full remission with a remissionModel', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: RemissionModel) => of(param2));
    const remissionModel = new RemissionModel();
    remissionModel.hwf_amount = 100;
    addFeeDetailService.remissionModel = remissionModel;
    addFeeDetailService.postFullRemission()
    .then((response) => {
      expect(response.hwf_amount).toBe(100);
      expect(response.site_id).toBe('AA02');
    });
  });
});
