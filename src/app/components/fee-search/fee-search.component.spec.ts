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
    testFixedFlatFee: any,
    testFixedVolumeFee: any;

  beforeEach(() => {
    testFixedFlatFee = {
      code: 'test-code',
      fee_type: 'fixed',
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

    testFixedVolumeFee = {
      code: 'test-code',
      fee_type: 'fixed',
      'current_version': {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        volume_amount: {
          amount: 1234
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
    component.selectFee(testFixedFlatFee);
    fixture.detectChanges();
    expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
      fees: [{
        code: testFixedFlatFee.code,
        version: testFixedFlatFee['current_version'].version.toString(),
        'calculated_amount': testFixedFlatFee['current_version'].flat_amount.amount.toString(),
        'memo_line': testFixedFlatFee['current_version'].memo_line,
        'natural_account_code': testFixedFlatFee['current_version'].natural_account_code,
        'ccd_case_number': component.ccdNo,
        jurisdiction1: testFixedFlatFee.jurisdiction1.name,
        jurisdiction2: testFixedFlatFee.jurisdiction2.name,
        description: testFixedFlatFee.current_version.description
      }]
    });
  });

  it('Should set ccd number from URL', async(async () => {
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  it('Should navigate to fee-summary page using correct CCD case number and payment group reference', async(async () => {
    spyOn(router, 'navigateByUrl');
    component.selectFee(testFixedFlatFee);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&paymentGroupRef=2019-12341234');
  }));

  describe('If fixed volume fee is selected', () => {
    it('should make fee-details component visible and fee-search component invisible', async(async () => {
      component.selectFee(testFixedVolumeFee);
      fixture.detectChanges();
      expect(component.showFeeDetails).toBe(true);
    }));

    it('should remember which fee was selected', async(async () => {
      component.selectFee(testFixedVolumeFee);
      fixture.detectChanges();
      expect(component.preselectedFee).toBe(testFixedVolumeFee);
      expect(component.ccdNo).toBe('1234-1234-1234-1234');
    }));
  });

  describe('Submitting volume fee', () => {
    it('should call backend with correct fee details', async(async () => {
      const volume = 2;
      component.selectFee(testFixedVolumeFee);
      component.selectPreselectedFeeWithVolume(volume);
      fixture.detectChanges();
      expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
        fees: [{
          code: testFixedVolumeFee.code,
          version: testFixedVolumeFee['current_version'].version.toString(),
          'calculated_amount': `${testFixedVolumeFee['current_version'].volume_amount.amount * volume}`.toString(),
          'memo_line': testFixedVolumeFee['current_version'].memo_line,
          'natural_account_code': testFixedVolumeFee['current_version'].natural_account_code,
          'ccd_case_number': component.ccdNo,
          jurisdiction1: testFixedVolumeFee.jurisdiction1.name,
          jurisdiction2: testFixedVolumeFee.jurisdiction2.name,
          description: testFixedVolumeFee.current_version.description,
          volume: volume,
          volume_amount: testFixedVolumeFee.current_version.volume_amount.amount
        }]
      });
    }));
  });
});
