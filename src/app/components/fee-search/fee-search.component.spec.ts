import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FeeSearchComponent} from './fee-search.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaybubbleHttpClient} from '../../services/httpclient/paybubble.http.client';
import {instance, mock, anyFunction} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';
import {Meta} from '@angular/platform-browser';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
    fixture: ComponentFixture<FeeSearchComponent>,
    paymentGroupService: PaymentGroupService,
    routerService: any,
    activatedRoute: any,
    router: Router,
    testFee: any,
    testVolumeFee: any;

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

    testVolumeFee = {
      code: 'test-volume-fee',
      fee_type: 'fixed',
      'current_version': {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        volume_amount: {
          amount: 5
        },
        description: 'test-description'
      },
      ccdCaseNumber: '1111-2222-3333-4444',
      jurisdiction1: {name: 'test-jurisdiction1'},
      jurisdiction2: {name: 'test-jurisdiction2'},
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
      navigateByUrl: () => true
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
    const sampleResponse = JSON.stringify({data: {payment_group_reference: '2019-12341234'}});
    spyOn(paymentGroupService, 'postPaymentGroup').and.returnValue(<any>{then: (fun) => fun(sampleResponse)});
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should pass selected fee into POST call for backend', () => {
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

  it('Should go to volume page for volume fee ', () => {
    component.selectFee(testVolumeFee);
    fixture.detectChanges();
    expect(component.preselectedFee).toBe(testVolumeFee);
    expect(component.showFeeDetails).toBeTruthy();
  });

  it('Should create a correct params with volume for volume fee ', () => {
    component.selectFee(testVolumeFee);
    component.selectPreselectedFeeWithVolume(10);
    fixture.detectChanges();
    expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
      fees: [{
        code: testVolumeFee.code,
        version: testVolumeFee['current_version'].version.toString(),
        'calculated_amount': (testVolumeFee['current_version'].volume_amount.amount * 10).toString(),
        'memo_line': testVolumeFee['current_version'].memo_line,
        'natural_account_code': testVolumeFee['current_version'].natural_account_code,
        'ccd_case_number': component.ccdNo,
        jurisdiction1: testVolumeFee.jurisdiction1.name,
        jurisdiction2: testVolumeFee.jurisdiction2.name,
        description: testVolumeFee.current_version.description,
        volume: 10,
        volume_amount: testVolumeFee.current_version.volume_amount.amount
      }]
    });
  });

  it('Should set ccd number from URL', async(async () => {
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  it('Should navigate to fee-summary page using correct CCD case number and payment group reference', async(async () => {
    spyOn(router, 'navigateByUrl');
    component.selectFee(testFee);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&paymentGroupRef=2019-12341234');
  }));
});
