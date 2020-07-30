import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
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
    testFixedVolumeFee: any,
    testBandedFlatFee: any,
    testRateableFlatFee: any,
    testRangedPercentFee: any,
    mockResponse: any;

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
          amount: '1234'
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

    testBandedFlatFee = {
      code: 'test-code',
      fee_type: 'banded',
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

    testRateableFlatFee = {
      code: 'test-code',
      fee_type: 'rateable',
      'current_version': {
        version: 1,
        calculatedAmount: 0,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: {
          amount: 12340
        },
        description: 'test-description'
      },
      ccdCaseNumber: '1111-2222-3333-4444',
      jurisdiction1: {name: 'test-jurisdiction1'},
      jurisdiction2: {name: 'test-jurisdiction2'},
    };

    testRangedPercentFee = {
      code: 'test-code',
      fee_type: 'ranged',
      'current_version': {
        version: 1,
        calculatedAmount: 0,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        percentage_amount: {
          percentage: 0.05
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
          'ccdCaseNumber': '1234-1234-1234-1234',
          'isBulkScanning': 'Enable'
        }
      }
    };
    routerService = {
      navigateByUrl: jasmine.createSpy('navigate'),
      navigate: jasmine.createSpy('navigate')
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
    spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
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
        description: testFixedFlatFee.current_version.description,
        volume: 1,
        fee_amount: testFixedFlatFee.current_version.flat_amount.amount
      }]
    });
  });

  it('Should set ccd number from URL', async(async () => {
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  it('Should reset preselected fee and show fee details ongoback', () => {
    component.onGoBack();
    expect(component.preselectedFee).toBeNull();
    expect(component.showFeeDetails).toBeFalsy();
  });

  it('Should navigate to fee-summary page using correct CCD case number and payment group reference', async() => {
    spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
    component.paymentGroupRef = 'paymentgroup';
    component.selectFee(testFixedFlatFee);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&selectedOption=undefined&paymentGroupRef=paymentgroup');
  });


  it('Should call putPaymentGroup payment group ref is existed', async(async () => {
    spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
    component.paymentGroupRef = 'paymentgroup';
    component.selectFee(testFixedFlatFee);
    expect(paymentGroupService.putPaymentGroup).toHaveBeenCalled();
  }));

  describe('If fixed volume fee is selected', () => {
    it('should make fee-details component visible and fee-search component invisible', async(async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      component.selectFee(testFixedVolumeFee);
      fixture.detectChanges();
      expect(component.showFeeDetails).toBe(true);
    }));

    it('should remember which fee was selected', async(async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      component.selectFee(testFixedVolumeFee);
      fixture.detectChanges();
      expect(component.preselectedFee).toBe(testFixedVolumeFee);
      expect(component.ccdNo).toBe('1234-1234-1234-1234');
    }));
  });

  describe('If banded flat fee is selected', () => {
    it('should make fee-details component visible and fee-search component invisible', async(async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      component.selectFee(testFixedVolumeFee);
      fixture.detectChanges();
      expect(component.showFeeDetails).toBe(true);
    }));

    it('should remember which fee was selected', async(async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      component.selectFee(testBandedFlatFee);
      fixture.detectChanges();
      expect(component.preselectedFee).toBe(testBandedFlatFee);
      expect(component.ccdNo).toBe('1234-1234-1234-1234');
    }));
  });

  describe('Submitting volume fee', () => {
    it('should call backend with correct fee details', async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      const volume = 2;
      component.selectFee(testFixedVolumeFee);
      component.selectPreselectedFeeWithVolume(volume);
      await fixture.whenStable();
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
          fee_amount: testFixedVolumeFee.current_version.volume_amount.amount
        }]
      });
    });
  });

  describe('Submitting volume for banded fee', () => {
    it('should call backend with correct fee details', async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      const volume = 2;
      component.selectFee(testBandedFlatFee);
      component.selectPreselectedFeeWithVolume(volume);
      await fixture.whenStable();
      expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
        fees: [{
          code: testBandedFlatFee.code,
          version: testBandedFlatFee['current_version'].version.toString(),
          'calculated_amount': `${testBandedFlatFee['current_version'].flat_amount.amount * volume}`.toString(),
          'memo_line': testBandedFlatFee['current_version'].memo_line,
          'natural_account_code': testBandedFlatFee['current_version'].natural_account_code,
          'ccd_case_number': component.ccdNo,
          jurisdiction1: testBandedFlatFee.jurisdiction1.name,
          jurisdiction2: testBandedFlatFee.jurisdiction2.name,
          description: testBandedFlatFee.current_version.description,
          volume: volume,
          fee_amount: testBandedFlatFee.current_version.flat_amount.amount
        }]
      });
    });
  });

  it('Should navigate to service-failure', () => {
    component.navigateToServiceFailure();
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/service-failure');
  });

  it('should navigate to service failure when postPayment return error', fakeAsync(() => {
    spyOn(paymentGroupService, 'postPaymentGroup').and.returnValue(Promise.reject('Promise should not be resolved'));
    spyOn(component, 'navigateToServiceFailure');
    component.paymentGroupRef = null;
    component.dcnNo = null;
    component.sendPaymentGroup(null);
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

  it('should navigate to service failure when putPayment return error', fakeAsync(() => {
    spyOn(paymentGroupService, 'putPaymentGroup').and.returnValue(Promise.reject('Promise should not be resolved'));
    spyOn(component, 'navigateToServiceFailure');
    component.paymentGroupRef = 'test';
    component.dcnNo = '11';
    component.sendPaymentGroup('test');
    tick();
    expect(component.navigateToServiceFailure).toHaveBeenCalled();
  }));

  describe('Submitting fee amount for rateable fee', () => {
    it('should call backend with rateable fee and flat amount', async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      const emitted_value = 2;
      component.selectFee(testRateableFlatFee);
      component.selectPreselectedFeeWithVolume(emitted_value);
      await fixture.whenStable();
      expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
        fees: [{
          code: testRateableFlatFee.code,
          version: testRateableFlatFee['current_version'].version.toString(),
          'calculated_amount': emitted_value,
          'memo_line': testRateableFlatFee['current_version'].memo_line,
          'natural_account_code': testRateableFlatFee['current_version'].natural_account_code,
          'ccd_case_number': component.ccdNo,
          jurisdiction1: testRateableFlatFee.jurisdiction1.name,
          jurisdiction2: testRateableFlatFee.jurisdiction2.name,
          description: testRateableFlatFee.current_version.description,
          volume: null,
          fee_amount: testRateableFlatFee.current_version.flat_amount.amount
        }]
      });
    });
  });

  describe('Submitting fee amount for ranged fee and percentage amont', () => {
    it('should call backend with ranged fee and percentage amount', async () => {
      spyOn(paymentGroupService, 'postPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      spyOn(paymentGroupService, 'putPaymentGroup').and.callFake(() => Promise.resolve(mockResponse));
      const emitted_value = 2;
      component.selectFee(testRangedPercentFee);
      component.selectPreselectedFeeWithVolume(emitted_value);
      await fixture.whenStable();
      expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith({
        fees: [{
          code: testRangedPercentFee.code,
          version: testRangedPercentFee['current_version'].version.toString(),
          'calculated_amount': emitted_value,
          'memo_line': testRangedPercentFee['current_version'].memo_line,
          'natural_account_code': testRangedPercentFee['current_version'].natural_account_code,
          'ccd_case_number': component.ccdNo,
          jurisdiction1: testRangedPercentFee.jurisdiction1.name,
          jurisdiction2: testRangedPercentFee.jurisdiction2.name,
          description: testRangedPercentFee.current_version.description,
          volume: null,
          fee_amount: testRangedPercentFee.current_version.percentage_amount.percentage
        }]
      });
    });
  });
});
