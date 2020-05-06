import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CcdSearchComponent } from './ccd-search.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
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
    viewPaymentService: ViewPaymentService,
    paymentGroupService: PaymentGroupService,
    mockResponse: any,
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
                takePayment: true
              }
            }
          }
        }
      ]
    });
    mockResponse = {
        data: {
          ccd_reference: '1111222233334444',
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
    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
    component.searchForm = formBuilder.group({
      CCDorException: null
    });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    viewPaymentService = fixture.debugElement.injector.get(ViewPaymentService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialise the search input to an empty string', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.searchForm.get('searchInput').value).toBe('');
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(activatedRoute, 'params').and.returnValue(of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

   it('Should initialise the search input to an empty string', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.searchForm.get('searchInput').value).toBe('');
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });
  it('Search form should be invalid if a wrong format string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('test');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be valid if a correct format string has been entered', async () => {
    spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&isBulkScanning=Enable');
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
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
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
    component.onSelectionChange('PRN');
    expect(component.selectedValue).toBe('PRN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('prn');
    component.searchForm.controls['searchInput'].setValue('RC-1577-2020-5487-0301');
    component.searchFees();
    await fixture.whenStable();
    expect(component.selectedValue).toBe('PRN');
    component.dcnNumber = '';
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    component.isBulkscanningEnable = false;
  });

  it('Should get dcn details', async () => {
    mockResponse['data'].ccd_reference = null;
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
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
    expect(component.ccdCaseNumber).toBe('1111222233234444');
  });

  it('Should get prn details', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    component.ngOnInit();
    component.dcnNumber = '';
    component.ccdCaseNumber = '';
    component.takePayment = true;
    component.isBulkscanningEnable = true;
    component.onSelectionChange('PRN');
    expect(component.selectedValue).toBe('PRN');
    spyOn(component.selectedValue, 'toLocaleLowerCase').and.returnValue('prn');
    component.searchForm.controls['searchInput'].setValue('RC-1577-2020-5487-0301');
    let ccd_case_number = '1111-2222-3333-4444';
    ccd_case_number = component.removeHyphenFromString(ccd_case_number);
    component.ccdCaseNumber = ccd_case_number;
    component.searchFees();
    expect(ccd_case_number).toBe('1111222233334444');
    await fixture.whenStable();
    expect(component.selectedValue).toBe('PRN');
    expect(component.dcnNumber).toBe('');
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    component.isBulkscanningEnable = false;
  });

  it('Should get go to correct navigation', async () => {
    mockResponse['data'].ccd_reference = null;
    spyOn(paymentGroupService, 'getBSPaymentsByDCN').and.callFake(() => Promise.resolve(mockResponse));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
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
    expect(component.ccdCaseNumber).toBe('1111222233234444');
    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233234444?selectedOption=DCN&dcn=111122223333444401234&view=case-transactions&takePayment=true&isBulkScanning=Enable');
  });
});


describe('ccd search component without takePayment option', () => {
  let component: CcdSearchComponent,
    fixture: ComponentFixture<CcdSearchComponent>,
    caseRefService: CaseRefService,
    viewPaymentService: ViewPaymentService,
    paymentGroupService: PaymentGroupService,
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
                takePayment: 'false'
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
    component.searchForm = formBuilder.group({
      CCDorException: null
    });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    viewPaymentService = fixture.debugElement.injector.get(ViewPaymentService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Search form should be invalid if an empty string has been entered', async () => {
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    spyOn(activatedRoute, 'params').and.returnValue(of({}));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be valid if a correct format string has been entered', async () => {
    spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
    spyOn(viewPaymentService, 'getPaymentDetail').and.callFake(() => of({}));
    spyOn(paymentGroupService, 'getBSFeature').and.callFake(() => Promise.resolve(true));
    await component.ngOnInit();
    await component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');
    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?selectedOption=CCDorException&dcn=null&view=case-transactions&isBulkScanning=Enable');
  });
});
