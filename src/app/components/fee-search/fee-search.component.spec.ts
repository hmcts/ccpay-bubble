import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {FeeSearchComponent} from './fee-search.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaybubbleHttpClient} from '../../services/httpclient/paybubble.http.client';
import {instance, mock} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';
import {Meta} from '@angular/platform-browser';
import { IPaymentGroup } from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
    fixture: ComponentFixture<FeeSearchComponent>,
    paymentGroupService: PaymentGroupService,
    routerService: any,
    activatedRoute: any,
    router: Router,
    testFee: any,
    mockResponse: IPaymentGroup;

  beforeEach(() => {
    testFee = {
      code: 'test-code',
      'current_version': {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: {
          amount: 1234
        },
        description: 'test-description'
      },
      ccdCaseNumber: '1111-2222-3333-4444',
      jurisdiction1: {name: 'test-jurisdiction1'},
      jurisdiction2: {name: 'test-jurisdiction2'},
    };
    mockResponse = {
      payment_group_reference : '2019-12341234',
      fees: [{id: 808,
        code: 'FEE0490',
        version: '1',
        calculated_amount: 44,
        memo_line: 'RECEIPT OF FEES',
        ccd_case_number: '1111-2222-3333-4444',
        net_amount: 44,
        description: 'description',
        volume: 1,
        jurisdiction1: 'civil',
        jurisdiction2: 'civil',
        reference: 'test'}],
      payments: [],
      remissions: []
      };
    activatedRoute = {
      params: {
        subscribe: (fun) => fun()
      },
      snapshot: {
        queryParams: {
          'ccdCaseNumber': '1234-1234-1234-1234'
        }
      }
    };
    routerService = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: Router, useValue: routerService},
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should pass selected fee into POST call for backend', () => {
    spyOn(paymentGroupService, 'postPaymentGroup').and
    .returnValue(Promise.resolve(mockResponse));
    component.selectFee(testFee);
    fixture.detectChanges();
    expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
      fees: [{
        code: testFee.code,
        version: testFee['current_version'].version.toString(),
        'calculated_amount': testFee['current_version'].flat_amount.amount.toString(),
        'memo_line': testFee['current_version'].memo_line,
        'natural_account_code': testFee['current_version'].natural_account_code,
        'ccd_case_number': component.ccdNo,
        jurisdiction1: testFee.jurisdiction1.name,
        jurisdiction2: testFee.jurisdiction2.name,
        description: testFee.current_version.description
      }]
    });
  });

  it('Should set ccd number from URL', async(async () => {
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  // it('Should navigate to fee-summary page using correct CCD case number and payment group reference', async(async () => {
  //   spyOn(paymentGroupService, 'postPaymentGroup').and
  //   .returnValue(Promise.resolve(mockResponse));
  //   component.selectFee(testFee);
  //   await fixture.whenStable();
  //   fixture.detectChanges();

  //   expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
  //   expect(router.navigateByUrl)
  //     .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&paymentGroupRef=2019-12341234');
  // }));

  it('Should call postPaymentGroup payment group ref is undefined', async(async () => {
    spyOn(paymentGroupService, 'postPaymentGroup').and
    .returnValue(Promise.resolve(mockResponse));
    component.selectFee(testFee);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.paymentGroupRef).toBeUndefined();
    expect(paymentGroupService.postPaymentGroup).toHaveBeenCalled();
  }));

  it('Should call putPaymentGroup payment group ref is existed', async(async () => {
    spyOn(paymentGroupService, 'putPaymentGroup').and
    .returnValue(Promise.resolve(mockResponse));
    component.paymentGroupRef = 'paymentgroup';
    component.selectFee(testFee);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(paymentGroupService.putPaymentGroup).toHaveBeenCalled();
  }));

  it('Should navigate to service-detail', () => {
    component.navigateToServiceFailure();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/service-failure');
  });

  it('Should reset preselected fee and show fee details ongoback', () => {
    component.onGoBack();
    expect(component.preselectedFee).toBeNull();
    expect(component.showFeeDetails).toBeFalsy();
  });

  it('should navigate to service failure when postPayment return error', fakeAsync(() => {
    spyOn(paymentGroupService, 'postPaymentGroup').and.returnValue(Promise.reject('Promise should not be resolved'));
    spyOn(component, 'navigateToServiceFailure');
    component.paymentGroupRef = null;
    component.sendPaymentGroup(null);
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

  it('should navigate to service failure when putPayment return error', fakeAsync(() => {
    spyOn(paymentGroupService, 'putPaymentGroup').and.returnValue(Promise.reject('Promise should not be resolved'));
    spyOn(component, 'navigateToServiceFailure');
    component.paymentGroupRef = 'test';
    component.sendPaymentGroup('test');
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

});
