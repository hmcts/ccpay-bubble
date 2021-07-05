import { PaymentGroupService } from './../../services/payment-group/payment-group.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeeDetailsComponent} from './fee-details.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { instance, mock, anyFunction } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

describe('FeeDetailsComponent', () => {
  let component: FeeDetailsComponent;
  let fixture: ComponentFixture<FeeDetailsComponent>;
  let testFeeVersions: any;
  let paymentGroupService: PaymentGroupService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeeDetailsComponent],
      providers: [
        FormBuilder,
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        }
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    testFeeVersions = {
        version: 1,
        calculatedAmount: 0,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: {
          amount: 12340
        },
        description: 'test-description'
    };
    fixture = TestBed.createComponent(FeeDetailsComponent);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    component = fixture.componentInstance;
    component.fee = {
      code: 'test-code',
      fee_type: 'banded',
      fee_versions: [
        {
          description: 'Recovery order (section 50)',
          status: 'approved',
          author: '126172',
          approvedBy: '126175',
          version: 1,
          valid_from: '2014-04-21T00:00:00.000+0000',
          valid_to: '2014-04-21T00:00:00.000+0000',
          flat_amount: {
            'amount': 215
          },
          memo_line: 'RECEIPT OF FEES - Family misc private',
          statutory_instrument: '2014 No 877 ',
          si_ref_id: '2.1q',
          natural_account_code: '4481102174',
          fee_order_name: 'Family Proceedings',
          direction: 'cost recovery'
        }
      ],
      current_version: {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: {
          amount: 1234
        },
        description: 'test-description'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should restart search event ongoback', () => {
    spyOn(component.restartSearchEvent, 'emit');
    component.goBack();
    expect(component.restartSearchEvent.emit).toHaveBeenCalled();
  });

  it('Should set isDiscontinuedFeatureEnabled from URL', async () => {
    spyOn(paymentGroupService, 'getDiscontinuedFrFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnChanges();
    expect(component.isDiscontinuedFeatureEnabled).toBeTruthy();
  });

  it('Should  submit fee volume', () => {
    const submitEventemmitter = Object({ volumeAmount: 1, selectedVersionEmit: undefined, isDiscontinuedFeeAvailable: false });
    spyOn(component.submitFeeVolumeEvent, 'emit');
    component.submitVolume();
    expect(component.submitFeeVolumeEvent.emit).toHaveBeenCalledWith(submitEventemmitter);
  });
  it('Should  submit fee volume with feeversion', () => {
    spyOn(component.submitFeeVolumeEvent, 'emit');

    const submitEventemmitter = Object({ volumeAmount: 1, selectedVersionEmit: {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      flat_amount: {
        amount: '0'
      },
      description: 'test-description'
  }, isDiscontinuedFeeAvailable: false });

    component.getSelectedFeesVersion(testFeeVersions);
    component.submitVolume();
    expect(component.submitFeeVolumeEvent.emit).toHaveBeenCalledWith(submitEventemmitter);
  });

  it('Should get volume_amount if volume_amount available', () => {
    const feeVersion0: any = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      volume_amount: {
      },
      description: 'test-description'
  };
    const result = component.getAmountFromFeeVersion(feeVersion0);
    expect(result).toBe(feeVersion0['volume_amount'].amount);
  });

  it('Should get flat_amount if flat_amount available', () => {
    const feeVersion1: any = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      flat_amount: {
        amount: 5
      },
      description: 'test-description'
  };
    const result1 = component.getAmountFromFeeVersion(feeVersion1);
    expect(result1).toBe(feeVersion1['flat_amount'].amount);
  });

  it('Should get percentage_amount if percentage_amount available', () => {
    const feeVersion2: any  = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      percentage_amount: {
        percentage: 10
      },
      description: 'test-description'
  };
    const result2 = component.getAmountFromFeeVersion(feeVersion2);
    expect(result2).toBe(feeVersion2['percentage_amount'].percentage);
  });

  it('Should return false if there no valid_to  and valid_from value', () => {
    const feeVersion3: any  = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      percentage_amount: {
        percentage: 10
      },
      description: 'test-description'
  };
    const result3 = component.getValidFeeVersionsBasedOnDate(feeVersion3);
    expect(result3).toBe(false);
  });

  it('Should return true if  valid_to has value and no valid_from value', () => {

    const feeVersion4: any  = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      valid_to: '2020-05-10',
      percentage_amount: {
        percentage: 10
      },
      description: 'test-description'
  };
    const result4 = component.getValidFeeVersionsBasedOnDate(feeVersion4);
    expect(result4).toBe(false);
  });

  it('Should return true if valid_from has value and no valid_to value', () => {

    const feeVersion5: any  = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      valid_from: '2020-05-10',
      valid_to: '',
      percentage_amount: {
        percentage: 10
      },
      description: 'test-description'
  };
    const result5 = component.getValidFeeVersionsBasedOnDate(feeVersion5);
    expect(result5).toBe(false);
  });

  it('Should return false if valid_from  and no valid_to has nore than six month value', () => {

    const feeVersion6: any  = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      valid_from: '2019-05-10',
      valid_to: '2020-01-01',
      percentage_amount: {
        percentage: 10
      },
      description: 'test-description'
  };
    const result6 = component.getValidFeeVersionsBasedOnDate(feeVersion6);
    expect(result6).toBe(false);
  });

  it('Should return false if valid_from  and no valid_to has nore than six 111month value', () => {
    component.fee = {
      'code': 'FEE0001',
      'fee_type': 'banded',
      'fee_versions': [
         {
            'description': 'description1',
            'status': 'approved',
            'author': 'author1',
            'approvedBy': 'approvedBy1',
            'version': 1,
            'valid_from': '2019-11-04T13:18:31.550+0000',
            'valid_to': '2020-11-04T13:18:31.550+0000',
            'flat_amount': {
               'amount': 0.50
            },
            'memo_line': 'memoline1',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         },
         {
            'description': 'description2',
            'status': 'approved',
            'author': 'author2',
            'approvedBy': 'approvedBy2',
            'version': 3,
            'valid_from': '2019-11-04T00:00:00.000+0000',
            'valid_to': '2020-11-04T00:00:00.000+0000',
            'flat_amount': {
               'amount': 90.00
            },
            'memo_line': 'memoline2',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         },
         {
            'description': 'description3',
            'status': 'approved',
            'author': 'author3',
            'approvedBy': 'approvedBy3',
            'version': 4,
            'valid_from': '2019-11-04T00:00:00.000+0000',
            'valid_to': null,
            'flat_amount': {
               'amount': 120.00
            },
            'memo_line': 'memoline3',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         },
         {
            'description': 'description4',
            'status': 'approved',
            'author': 'a',
            'approvedBy': 'approvedBy4',
            'version': 6,
            'valid_from': '2020-11-30T00:00:00.000+0000',
            'valid_to': '2020-12-30T00:00:00.000+0000',
            'flat_amount': {
               'amount': 150.00
            },
            'memo_line': 'memoline4',
            'statutory_instrument': '2020 No 786',
            'si_ref_id': '2020.B',
            'natural_account_code': '20202020',
            'fee_order_name': 'DEMO ORDER 2020',
            'direction': 'enhanced'
         }
      ],
      'current_version': {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: {
          amount: 1234
        },
        description: 'test-description'
      }
   };
    const result7 = component.validOldFeesVersions(component.fee);
    expect(result7.length).toBe(0);
  });

  it('Should return true if current version is undefined', () => {
    component.fee = {
      'code': 'FEE0001',
      'fee_type': 'banded',
      'fee_versions': [
         {
            'description': 'description1',
            'status': 'approved',
            'author': 'author1',
            'approvedBy': 'approvedBy1',
            'version': 1,
            'valid_from': '2020-11-04T13:18:31.550+0000',
            'valid_to': '2021-02-04T13:18:31.550+0000',
            'flat_amount': {
               'amount': 0.50
            },
            'memo_line': 'memoline1',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         }
      ]
   };
   component.validOldFeesVersions(component.fee);
   component.submitVolume();
   expect(component.fee.fee_versions.length).toBe(1);
   expect(component.fee.current_version).toBeUndefined();
   expect(component.validOldVersionArray.length).toBe(1);
  });

  it('Should return true if current version is undefined1', () => {
    component.fee = {
      'code': 'FEE0001',
      'fee_type': 'banded',
      'fee_versions': [
         {
            'description': 'description1',
            'status': 'approved',
            'author': 'author1',
            'approvedBy': 'approvedBy1',
            'version': 1,
            'valid_from': '2020-11-04T13:18:31.550+0000',
            'valid_to': null,
            'flat_amount': {
               'amount': 0.50
            },
            'memo_line': 'memoline1',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         }
      ]
   };
   component.validOldFeesVersions(component.fee);
   component.submitVolume();
   expect(component.fee.fee_versions.length).toBe(1);
   expect(component.fee.current_version).toBeUndefined();
   expect(component.validOldVersionArray.length).toBe(0);
  });

  it('Should return true if current version is undefined2', () => {
    component.fee = {
      'code': 'FEE0001',
      'fee_type': 'banded',
      'fee_versions': [
         {
            'description': 'description1',
            'status': 'approved',
            'author': 'author1',
            'approvedBy': 'approvedBy1',
            'version': 1,
            'valid_from': '2020-11-04T13:18:31.550+0000',
            'valid_to': null,
            'flat_amount': {
               'amount': 0.50
            },
            'memo_line': 'memoline1',
            'statutory_instrument': '2014 No 874',
            'si_ref_id': '4.1a',
            'natural_account_code': '4481102150',
            'fee_order_name': 'Civil Proceedings',
            'direction': 'enhanced'
         },
         {
          'description': 'description1',
          'status': 'approved',
          'author': 'author1',
          'approvedBy': 'approvedBy1',
          'version': 1,
          'valid_from': '2020-11-04T13:18:31.550+0000',
          'valid_to': null,
          'flat_amount': {
             'amount': 0.50
          },
          'memo_line': 'memoline1',
          'statutory_instrument': '2014 No 874',
          'si_ref_id': '4.1a',
          'natural_account_code': '4481102150',
          'fee_order_name': 'Civil Proceedings',
          'direction': 'enhanced'
       }
      ]
   };
   component.validOldFeesVersions(component.fee);
   component.submitVolume();
   expect(component.fee.fee_versions.length).toBe(2);
   expect(component.fee.current_version).toBeUndefined();
  });
});

