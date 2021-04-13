import { TestBed, ComponentFixture } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CcdSearchComponent } from './ccd-search.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { instance, mock } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

const paybubbleHttpClientMock = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));

describe('CCD search component with takePayment is equal to true', () => {
  let component: CcdSearchComponent,
    fixture: ComponentFixture<CcdSearchComponent>,
    caseRefService: CaseRefService,
    paymentGroupService: PaymentGroupService,
    viewPaymentService: ViewPaymentService,
    mockResponse: any,
    mockResponse1: any,
    mockResponse2: any,
    mockResponse3: any,
    mockResponse4: any,
    activatedRoute;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcdSearchComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule
      ],
      providers: [
        CaseRefService,
        ViewPaymentService,
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        },
        { provide: PaybubbleHttpClient, useValue: paybubbleHttpClientMock },
        { provide: Router, useValue: routerMock },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            routeConfig: {
              path: 'ccd-search'
            },
            snapshot: {
              queryParams: {
                takePayment: false
              }
            }
          }
        }
      ]
    });
    mockResponse = {
        data: {
          ccd_reference: '1111222233334444',
          ccd_case_number: '1111222233334444',
          exception_record_reference: '1111222233234444',
          payments: [
            {
              amount: 100,
              bgc_reference: 'BGC1203',
              case_reference: '1111222233334444',
              payment_reference: 'RC-1577-2020-5487-0301',
              currency: 'GBP',
              date_banked: '2019-DEC-02',
              date_created: '2019-DEC-19',
              date_updated: '2019-DEC-30',
              dcn_case: '111122223333444401234',
              dcn_reference: '111122223333444401234',
              first_cheque_dcn_in_batch: 'string',
              outbound_batch_number: 'string',
              payer_name: 'tester',
              payment_method: 'CHEQUE',
              po_box: 'string'
            }
          ],
          responsible_service_id: 'AA07'
      }
    };


    mockResponse1 = {
        amount: 550,
        ccd_case_number: '1111222233334444',
        channel: 'telephony',
        currency: 'GBP',
        date_created: '2020-09-03T16:48:51.816+0000',
        date_updated: '2020-09-03T16:48:51.816+0000',
        external_provider: 'pci pal',
        fee: [
          {
            calculated_amount: 550,
            ccd_case_number: '1111222233334444',
            code: 'FEE0303',
            date_created: '2020-09-03T16:30:47.633+0000',
            date_updated: '2020-09-03T16:30:53.648+0000',
            id: 40,
            version: '1',
            volume: 1
          }
        ],
        method: 'card',
        payment_allocation: [],
        payment_group_reference: '2020-1599150647664',
        payment_reference: 'RC-1599-1517-2787-5110',
        service_name: 'Probate',
        site_id: 'AA08',
        status: 'Initiated',
        responsible_service_id: 'AA07',
        status_histories: [
          {
            date_created: '2020-09-03T16:48:51.824+0000',
            error_code: 'code',
            error_message: 'message',
            external_status: 'created',
            status: 'Initiated'
          }
        ]
  };
  mockResponse3 = '{\n "exception":"CMC_ExceptionRecord",\n "case":"MoneyClaimCase"}';

  mockResponse2 = {
    amount: 550,
    ccd_case_number: '1111222233334444',
    channel: 'telephony',
    currency: 'GBP',
    date_created: '2020-09-03T16:48:51.816+0000',
    date_updated: '2020-09-03T16:48:51.816+0000',
    external_provider: 'pci pal',
    fee: [
      {
        calculated_amount: 550,
        case_reference: '1111222233334444',
        code: 'FEE0303',
        date_created: '2020-09-03T16:30:47.633+0000',
        date_updated: '2020-09-03T16:30:53.648+0000',
        id: 40,
        version: '1',
        volume: 1
      }
    ],
    method: 'card',
    payment_allocation: [],
    payment_group_reference: '2020-1599150647664',
    payment_reference: 'RC-1599-1517-2787-5110',
    service_name: 'Probate',
    site_id: 'AA08',
    status: 'Initiated',
    responsible_service_id: 'AA07',
    status_histories: [
      {
        date_created: '2020-09-03T16:48:51.824+0000',
        error_code: 'code',
        error_message: 'message',
        external_status: 'created',
        status: 'Initiated'
      }
    ]
};
mockResponse4 = {
  data: {
     ccd_reference: '1111222299990000',
     exception_record_reference: '1111222233334444',
     responsible_service_id: 'AA08',
     all_payments_status: 'INCOMPLETE'
  },
  success: true
};
    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
    component.searchForm = formBuilder.group({
      CCDorException: null
    });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    viewPaymentService = fixture.debugElement.injector.get(ViewPaymentService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialise the search input to an empty string', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.searchForm.get('searchInput').value).toBe('');
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(activatedRoute, 'params').and.returnValue(of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

   it('Should initialise the search input to an empty string', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.searchForm.get('searchInput').value).toBe('');
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });
  it('Search form should be invalid if a wrong format string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('test');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be valid if a correct format string has been entered', async () => {
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
  });

  it('Should remove hyphems from ccd_case_number', () => {
    let ccd_case_number = '1111-2222-3333-4444';
    ccd_case_number = component.removeHyphenFromString(ccd_case_number);
    expect(ccd_case_number).toBe('1111222233334444');
  });


  it('Should set selected radio button category', () => {
    const selectedValue = 'DCN';
    component.onSelectionChange(selectedValue);
    expect(component.selectedValue).toBe('DCN');
    expect(component.searchForm.get('CCDorException').value).toBe('DCN');
  });
   it('Should get dcn details', async () => {
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = true;
    component.isBulkscanningEnable = true;
    component.onSelectionChange('DCN');
    expect(component.selectedValue).toBe('DCN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');
    component.searchForm.controls['searchInput'].setValue('111122223333444401234');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.dcnNumber).toBe('111122223333444401234');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    component.isBulkscanningEnable = false;
    component.onSelectionChange('CCDorException');
    expect(component.selectedValue).toBe('CCDorException');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('ccdorexception');
    component.searchForm.controls['searchInput'].setValue('111122223333444401234');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('CCDorException');
    expect(component.dcnNumber).toBe('111122223333444401234');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('rc');
    component.searchForm.controls['searchInput'].setValue('RC-1577-2020-5487-0301');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    component.dcnNumber = '';
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    component.isBulkscanningEnable = false;
  });

  it('Should get dcn details', async () => {
    mockResponse['data'].ccd_reference = null;
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.excReference = '';
    component.onSelectionChange('DCN');
    expect(component.selectedValue).toBe('DCN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');
    component.searchForm.controls['searchInput'].setValue('111122223333444401234');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.dcnNumber).toBe('111122223333444401234');
    expect(component.ccdCaseNumber).toBe('');
    mockResponse['data'].ccd_reference  = '1111222233334444';
    component.ccdCaseNumber =  mockResponse['data'].ccd_reference;
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.excReference).toBe('');
    mockResponse['data'].ccd_reference = undefined;
    mockResponse['data'].exception_record_reference = '1111222233234444';
    component.ccdCaseNumber = '';
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.excReference).toBe('1111222233234444');
  });

  it('Should get go to correct navigation', async () => {
    mockResponse['data'].ccd_reference = null;
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.onSelectionChange('DCN');
    expect(component.selectedValue).toBe('DCN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');
    component.searchForm.controls['searchInput'].setValue('111122223333444401234');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.dcnNumber).toBe('111122223333444401234');
    expect(component.ccdCaseNumber).toBe('');

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = true;
    component.isTurnOff = true;
    component.onSelectionChange('DCN');
    expect(component.selectedValue).toBe('DCN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');
    component.searchForm.controls['searchInput'].setValue('111122223333444401234');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.dcnNumber).toBe('111122223333444401234');
    expect(component.ccdCaseNumber).toBe('');
  });

  it('Should get prn details', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse1)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );
    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = true;
    component.isBulkscanningEnable = true;
    component.isTurnOff = true;

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.noCaseFound).toBeFalsy();

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = false;
    component.isTurnOff = false;
    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.noCaseFound).toBeFalsy();
   });

  it('Should get prn details if takepayment is false', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse1)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = true;
    component.isTurnOff = true;

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.noCaseFound).toBeFalsy();

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = false;
    component.isTurnOff = false;
    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.noCaseFound).toBeFalsy();
  });

  it('Should get prn details if selectoption is null', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse1)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = true;
    component.isTurnOff = true;

    component.onSelectionChange('test');
    expect(component.selectedValue).toBe('test');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('test');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('test');

    expect(component.hasErrors).toBeTruthy();
   });

   it('Should get prn details if exception', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse2)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = false;
    component.isTurnOff = true;

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('rc');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.hasErrors).toBeTruthy();
   });
   it('Should get prn details if validateCaseRef return error', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse3)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(throwError(new Error('Test error')));

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = true;
    component.isTurnOff = true;

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('rc');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.noCaseFound).toBeFalsy();
   });
   it('Should get prn details if getPaymentDetail return error', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(throwError(new Error('Test error')));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(throwError(new Error('Test error')));

    component.ngOnInit();

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('rc');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.noCaseFoundInCCD).toBeTruthy();
   });
   it('ccd case serch error scenarios', async () => {
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(throwError(new Error('Test error')));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    await component.ngOnInit();
    component.onSelectionChange('CCDorException');
    expect(component.selectedValue).toBe('CCDorException');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('ccdorexception');
    await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.noCaseFoundInCCD).toBeTruthy();
  });

  it('Should get prn details', async () => {
    spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
      of(mockResponse1)
    );
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse3)
    );

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = true;
    component.isBulkscanningEnable = true;
    component.isStrategicFixEnable = true;
    component.isTurnOff = true;

    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.noCaseFound).toBeFalsy();
    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?selectedOption=RC&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Enable&isTurnOff=Enable&isOldPcipalOff=Disable&isNewPcipalOff=Disable');

    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = false;
    component.isBulkscanningEnable = false;
    component.isStrategicFixEnable = false;
    component.isTurnOff = false;
    component.onSelectionChange('RC');
    expect(component.selectedValue).toBe('RC');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
    component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('RC');
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('');
    expect(component.noCaseFound).toBeFalsy();
    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?selectedOption=RC&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Enable&isTurnOff=Enable&isOldPcipalOff=Disable&isNewPcipalOff=Disable');
  });
});


describe('ccd search component without takePayment option', () => {
  let component: CcdSearchComponent,
    fixture: ComponentFixture<CcdSearchComponent>,
    caseRefService: CaseRefService,
    paymentGroupService: PaymentGroupService,
    viewPaymentService: ViewPaymentService,
    activatedRoute,
    mockResponse: any,
    mockResponse1: any,
    mockResponse4: any;

  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcdSearchComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule
      ],
      providers: [
        CaseRefService,
        ViewPaymentService,
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        },
        { provide: PaybubbleHttpClient, useValue: paybubbleHttpClientMock },
        { provide: Router, useValue: routerMock },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            routeConfig: {
              path: 'ccd-search'
            },
            snapshot: {
              queryParams: {
                takePayment: 'false'
              }
            }
          }
        }
      ]
    });
    mockResponse = '{\n "exception":"CMC_ExceptionRecord",\n "case":"MoneyClaimCase"}';
    mockResponse1 = '{"case_type":"MoneyClaimCase"}';
    mockResponse4 = {
      data: {
         ccd_reference: '1111222299990000',
         exception_record_reference: '1111222233334444',
         responsible_service_id: 'AA08',
         all_payments_status: 'INCOMPLETE'
      },
      success: true
    };
    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
    component.searchForm = formBuilder.group({
      CCDorException: null
    });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    viewPaymentService = fixture.debugElement.injector.get(ViewPaymentService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(activatedRoute, 'params').and.returnValue(of({}));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be valid if a correct format string has been entered', async () => {
    spyOn(caseRefService, 'validateCaseRef').and.returnValue(
      of(mockResponse)
    );
    spyOn(paymentGroupService, 'getBSPaymentsByCCD').and.callFake(() => Promise.resolve(mockResponse4));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    expect(component.caseResponse.case).toBe('MoneyClaimCase');
    expect(component.caseType).toBe(null);
    expect(component.caseResponse.exception).toBe('CMC_ExceptionRecord');
  });

it('Search form should be valid if a correct format string has been entered1', async () => {
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse1)
  );
  spyOn(paymentGroupService, 'getBSPaymentsByCCD').and.callFake(() => Promise.resolve(mockResponse4));
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
  await component.ngOnInit();
  await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
  component.searchFees();
  fixture.detectChanges();
  expect(component.hasErrors).toBeFalsy();
  expect(component.dcnNumber).toBe(null);
  expect(component.ccdCaseNumber).toBe('1111222233334444');
  expect(component.caseResponse.case).toBeUndefined();
  expect(component.caseResponse.exception).toBeUndefined();
  expect(component.caseResponse['case_type']).toBe('MoneyClaimCase');
  expect(component.caseType).toBe(null);
});
});


describe('CCD search component with takePayment is equal to true', () => {
  let component: CcdSearchComponent,
    fixture: ComponentFixture<CcdSearchComponent>,
    caseRefService: CaseRefService,
    paymentGroupService: PaymentGroupService,
    viewPaymentService: ViewPaymentService,
    mockResponse: any,
    mockResponse1: any,
    mockResponse2: any,
    mockResponse3: any,
    mockResponse4: any,
    mockResponse5: any;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcdSearchComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule
      ],
      providers: [
        CaseRefService,
        ViewPaymentService,
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        },
        { provide: PaybubbleHttpClient, useValue: paybubbleHttpClientMock },
        { provide: Router, useValue: routerMock },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            routeConfig: {
              path: 'ccd-search'
            },
            snapshot: {
              queryParams: {
                takePayment: true
              }
            }
          }
        }
      ]
    });

    mockResponse = {
      data: {
        exception_record_reference: '3333333333333333',
        payments: [
          {
            amount: 100,
            bgc_reference: 'BGC1203',
            case_reference: '1111222233334444',
            payment_reference: 'RC-1577-2020-5487-0301',
            currency: 'GBP',
            date_banked: '2019-DEC-02',
            date_created: '2019-DEC-19',
            date_updated: '2019-DEC-30',
            dcn_case: '111122223333444401234',
            dcn_reference: '111122223333444401234',
            first_cheque_dcn_in_batch: 'string',
            outbound_batch_number: 'string',
            payer_name: 'tester',
            payment_method: 'CHEQUE',
            po_box: 'string'
          }
        ],
        responsible_service_id: 'AA07'
    }
  };

  mockResponse1 = {
    data: {
      ccd_reference: '2222222222222222',
      payments: [
        {
          amount: 100,
          bgc_reference: 'BGC1203',
          case_reference: '1111222233334444',
          payment_reference: 'RC-1577-2020-5487-0301',
          currency: 'GBP',
          date_banked: '2019-DEC-02',
          date_created: '2019-DEC-19',
          date_updated: '2019-DEC-30',
          dcn_case: '111122223333444401234',
          dcn_reference: '111122223333444401234',
          first_cheque_dcn_in_batch: 'string',
          outbound_batch_number: 'string',
          payer_name: 'tester',
          payment_method: 'CHEQUE',
          po_box: 'string'
        }
      ],
      responsible_service_id: 'AA07'
  }
};

mockResponse2 = {
    case_reference: '1111222233334444',
    ccd_case_number: '1111222233334444',
    payments: [
      {
        amount: 100,
        bgc_reference: 'BGC1203',
        case_reference: '1111222233334444',
        payment_reference: 'RC-1577-2020-5487-0301',
        currency: 'GBP',
        date_banked: '2019-DEC-02',
        date_created: '2019-DEC-19',
        date_updated: '2019-DEC-30',
        dcn_case: '111122223333444401234',
        dcn_reference: '111122223333444401234',
        first_cheque_dcn_in_batch: 'string',
        outbound_batch_number: 'string',
        payer_name: 'tester',
        payment_method: 'CHEQUE',
        po_box: 'string'
      }
    ],
    responsible_service_id: 'AA07'
};
mockResponse3 = {
  case_reference: '1111222233334444',
  payments: [
    {
      amount: 100,
      bgc_reference: 'BGC1203',
      case_reference: '1111222233334444',
      payment_reference: 'RC-1577-2020-5487-0301',
      currency: 'GBP',
      date_banked: '2019-DEC-02',
      date_created: '2019-DEC-19',
      date_updated: '2019-DEC-30',
      dcn_case: '111122223333444401234',
      dcn_reference: '111122223333444401234',
      first_cheque_dcn_in_batch: 'string',
      outbound_batch_number: 'string',
      payer_name: 'tester',
      payment_method: 'CHEQUE',
      po_box: 'string'
    }
  ],
  responsible_service_id: 'AA07'
};
mockResponse4 = {
  data: {
     ccd_reference: '1111222299990000',
     exception_record_reference: '1111222233334444',
     responsible_service_id: 'AA08',
     all_payments_status: 'INCOMPLETE'
  },
  success: true
};
mockResponse5 = '{\n "exception":"CMC_ExceptionRecord",\n "case":"MoneyClaimCase"}';
    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
    component.searchForm = formBuilder.group({
      CCDorException: null
    });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    viewPaymentService = fixture.debugElement.injector.get(ViewPaymentService);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('DCN search only case id present', async () => {
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse1));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');

    component.ngOnInit();
    component.dcnNumber = '';
    component.isBulkscanningEnable = true;
    component.onSelectionChange('DCN');
    expect(component.selectedValue).toBe('DCN');
    component.searchForm.controls['searchInput'].setValue('123456789012345678901');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('DCN');
    expect(component.dcnNumber).toBe('123456789012345678901');
    expect(component.ccdCaseNumber).toBe('2222222222222222');
    expect(component.excReference).toBe('');
    });

it('DCN search only exception id present', async () => {
  spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('dcn');

  component.ngOnInit();
  component.dcnNumber = '';
  component.takePayment = null;
  component.isBulkscanningEnable = true;
  component.onSelectionChange('DCN');
  expect(component.selectedValue).toBe('DCN');
  component.searchForm.controls['searchInput'].setValue('123456789012345678901');

  component.searchFees();
  await fixture.whenStable();
  expect(component.selectedValue).toBe('DCN');
  expect(component.dcnNumber).toBe('123456789012345678901');
  expect(component.ccdCaseNumber).toBe('');
  expect(component.excReference).toBe('3333333333333333');
 });

it('DCN search bulkscan false', async () => {
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse5)
  );
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));

  component.ngOnInit();
  component.dcnNumber = '';
  component.isBulkscanningEnable = false;
  component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');

  component.searchFees();
  await fixture.whenStable();
  expect(component.dcnNumber).toBeNull();
  expect(component.ccdCaseNumber).toBe('1111222233334444');
});

it('Should get RC details', async () => {
  spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
    of(mockResponse2)
  );
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse5)
  );

  component.ngOnInit();
  component.takePayment = false;
  component.isBulkscanningEnable = true;
  component.isStrategicFixEnable = false;
  component.onSelectionChange('RC');
  expect(component.selectedValue).toBe('RC');
  spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
  component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
  await component.searchFees();
  await fixture.whenStable();
  expect(component.selectedValue).toBe('RC');
  expect(component.dcnNumber).toBeNull();
  expect(component.ccdCaseNumber).toBe('1111222233334444');
  expect(component.noCaseFound).toBeFalsy();
});

it('Should get RC details', async () => {
  spyOn(viewPaymentService, 'getPaymentDetail').and.returnValue(
    of(mockResponse3)
  );
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse5)
  );

  component.ngOnInit();
  component.takePayment = false;
  component.isBulkscanningEnable = true;
  component.isStrategicFixEnable = false;
  component.onSelectionChange('RC');
  expect(component.selectedValue).toBe('RC');
  spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('RC');
  component.searchForm.controls['searchInput'].setValue('RC-1599-1517-2787-5110');
  await component.searchFees();
  await fixture.whenStable();
  expect(component.selectedValue).toBe('RC');
  expect(component.dcnNumber).toBeNull();
  expect(component.ccdCaseNumber).toBe('1111222233334444');
  expect(component.noCaseFound).toBeFalsy();
});
it('Should use ccd number if user search with excption which has ccd assinged', async () => {
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse5)
  );
  spyOn(paymentGroupService, 'getBSPaymentsByCCD').and.callFake(() => Promise.resolve(mockResponse4));
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
  await component.ngOnInit();
  await component.searchForm.controls['searchInput'].setValue('1111-2222-9999-0000');
  component.searchFees();
  fixture.detectChanges();
  expect(component.hasErrors).toBeFalsy();
  expect(component.dcnNumber).toBe(null);
  expect(component.ccdCaseNumber).toBe('1111222299990000');
});

it('Should use ccd number if user search with excption which has ccd assinged', async () => {
  spyOn(caseRefService, 'validateCaseRef').and.returnValue(
    of(mockResponse5)
  );
  spyOn(paymentGroupService, 'getBSPaymentsByCCD').and.callFake(() => Promise.reject({ message: 'failure' }));
  spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
  spyOn(paymentGroupService, 'getLDFeature').and.callFake(() => Promise.resolve(true));
  spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
  await component.ngOnInit();
  await component.searchForm.controls['searchInput'].setValue('1111-2222-9999-0000');
  component.searchFees();
  fixture.detectChanges();
  expect(component.hasErrors).toBeFalsy();
  expect(component.dcnNumber).toBe(null);
});
});
