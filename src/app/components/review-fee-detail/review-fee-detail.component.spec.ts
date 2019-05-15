import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FeeModel } from 'src/app/models/FeeModel';

describe('ReviewFeeDetailComponent', () => {
  let addFeeDetailService: AddFeeDetailService;
  let router: any;
  let http: PaybubbleHttpClient;
  let component: ReviewFeeDetailComponent;

  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailService = new AddFeeDetailService(http);
    router = { navigate: jasmine.createSpy('navigate')};
    component = new ReviewFeeDetailComponent(router, addFeeDetailService);
  });

  it('Should GET paymodel', () => {
    const paymodel = new PaymentModel();
    paymodel.amount = 0;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    expect(component.payModel).toEqual(paymodel);
  });

  it('Should GET remissionModel', () => {
    const remissionModel = new RemissionModel();
    remissionModel.ccd_case_number = '123';
    spyOnProperty(addFeeDetailService, 'remissionModel').and.returnValue(remissionModel);
    expect(component.remissionModel).toEqual(remissionModel);
  });

  it('Should call postFullRemission when payment model is 0', (done) => {
    const paymodel = new PaymentModel();
    paymodel.amount = 0;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    const spy = spyOn(addFeeDetailService, 'postFullRemission').and.returnValue(of({data: '123', success: true}).toPromise());
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postFullRemission).toHaveBeenCalled();
    spy.calls.mostRecent().returnValue.then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/confirmation']);
      done();
    });
  });

  it('Should call postPartialRemission from postPartialPayment when payment model > 0 and smaller than calculated amount', (done) => {
    const paymodel = new PaymentModel();
    paymodel.amount = 100;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPartialRemission').and.returnValue(of({data: '123', success: true}).toPromise());
    const paymentSpy = spyOn(addFeeDetailService, 'postPartialPayment').and
    .returnValue(of({data: {payment_group_reference: '', fees: [{id: '1'}]}, success: true}).toPromise());

    component.sendPayDetailsToPayhub();

    expect(addFeeDetailService.postPartialPayment).toHaveBeenCalled();

    paymentSpy.calls.mostRecent().returnValue.then(() => {
      expect(addFeeDetailService.postPartialRemission).not.toHaveBeenCalled();
      done();
    });
  });

  it('Should call postPartialRemission when payment model > 0 and smaller than calculated amount', () => {
    const paymodel = new PaymentModel();
    paymodel.amount = 100;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPartialPayment').and.returnValue(of({data: '123', success: true}).toPromise());
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postPartialPayment).toHaveBeenCalled();
  });

  it('Should call postPartialRemission and postPartialPayment when payment model > 0 and smaller than calculated amount', () => {
    const paymodel = new PaymentModel();
    paymodel.amount = 100;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPartialRemission').and.returnValue(of({data: '123', success: true}).toPromise());
    spyOn(addFeeDetailService, 'postPartialPayment').and
    .returnValue(of({data: {payment_group_reference: '', fees: [{id: '1'}]}, success: true}).toPromise());
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postPartialPayment).toHaveBeenCalled();
  });

  it('Should call postPayment when there is no remission', () => {
    const paymodel = new PaymentModel();
    paymodel.amount = 500;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPayment').and.returnValue(of({data: '123', success: true}).toPromise());
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postPayment).toHaveBeenCalled();
  });

  it('Should navigate to service-detail', () => {
    component.navigateToServiceFailure();
    expect(router.navigate).toHaveBeenCalledWith(['/service-failure']);
  });

  it('Should navigate back to the add fee details page', () => {
    component.onGoBack();
    expect(router.navigate).toHaveBeenCalledWith(['/addFeeDetail']);
  });
});
