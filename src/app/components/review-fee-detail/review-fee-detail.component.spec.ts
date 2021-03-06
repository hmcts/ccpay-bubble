import { fakeAsync, tick, flush } from '@angular/core/testing';
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

  it('Should call postFullRemission when paymodel.amount = 0', fakeAsync(() => {
    const paymodel = new PaymentModel();
    paymodel.amount = 0;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postFullRemission')
    .and.returnValue(Promise.resolve('{"data": {"remission_reference": "RM-1558-6210-2797-6387"}, "success": true}'));
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postFullRemission).toHaveBeenCalled();
    flush();
    expect(addFeeDetailService.remissionRef).toBe('RM-1558-6210-2797-6387');
    expect(router.navigate).toHaveBeenCalledWith(['/confirmation']);
  }));

  it('should navigate to service failure when postFullRemission return error', fakeAsync(() => {
    const paymodel = new PaymentModel();
    paymodel.amount = 0;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(component, 'navigateToServiceFailure');
    spyOn(addFeeDetailService, 'postFullRemission').and.returnValue(Promise.reject('test error'));
    component.sendPayDetailsToPayhub();
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

  it('Should call postPartialPayment when payment model > 0 and smaller than calculated amount', fakeAsync(() => {
    const paymodel = new PaymentModel();
    paymodel.amount = 100;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPartialPayment').and
    .returnValue(Promise.resolve('{"data":{"reference":"test","payment_group_reference":"2019-15586264153",' +
    '"fees":[{"id":180,"code":"FEE0002"}],"_links":{"next_url":{"href":"https://mockurl.com","method":"GET"}}},"success":true}'));
    spyOn(addFeeDetailService, 'postPartialRemission')
    .and.returnValue(Promise.resolve('{"data": {"remission_reference": "RM-1558-6210-2797-6387"}, "success": true}'));
    spyOn(addFeeDetailService, 'postPaymentUrl').and.returnValue(Promise.resolve('<p>test</p>'));
    component.sendPayDetailsToPayhub();
    expect(addFeeDetailService.postPartialPayment).toHaveBeenCalled();
    tick();
    expect(addFeeDetailService.postPartialRemission).toHaveBeenCalled();
    expect(addFeeDetailService.postPaymentUrl).toHaveBeenCalled();
    expect(component.payBubbleView).toBe('<p>test</p>');
  }));

  it('should navigate to service failure when postPartialPayment return error', fakeAsync(() => {
    const paymodel = new PaymentModel();
    paymodel.amount = 100;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(component, 'navigateToServiceFailure');
    spyOn(addFeeDetailService, 'postPartialPayment').and.returnValue(Promise.reject('test error'));
    component.sendPayDetailsToPayhub();
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

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

  it('should navigate to service failure when postPayment return error', fakeAsync(() => {
    const paymodel = new PaymentModel();
    paymodel.amount = 500;
    component.fee = new FeeModel();
    component.fee.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'paymentModel').and.returnValue(paymodel);
    spyOn(addFeeDetailService, 'postPayment').and.returnValue(Promise.reject('test error'));
    spyOn(component, 'navigateToServiceFailure');
    component.sendPayDetailsToPayhub();
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

  it('Should navigate to service-detail', () => {
    component.navigateToServiceFailure();
    expect(router.navigate).toHaveBeenCalledWith(['/service-failure']);
  });

  it('Should navigate back to the add fee details page', () => {
    component.onGoBack();
    expect(router.navigate).toHaveBeenCalledWith(['/addFeeDetail']);
  });
});
