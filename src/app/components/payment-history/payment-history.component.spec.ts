import {ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentHistoryComponent } from './payment-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { IdamDetails } from '../../services/idam-details/idam-details';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { instance, mock } from 'ts-mockito';

const roles: string[] = ['caseworker', 'payments'];
const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
  url: '/test?test=view'
};
const routerMock1 = {
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
  url: 'http://google.com/payment-history/view'
};
describe('Payment History case transaction component', () => {
  let component: PaymentHistoryComponent,
    fixture: ComponentFixture<PaymentHistoryComponent>,
    idamDetails: IdamDetails,
    paymentGroupService: PaymentGroupService;
  let activatedRoute: ActivatedRoute;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({ ccdCaseNumber: '1111-2222-3333-4444' }),
            snapshot: {
              queryParams: {
                takePayment: true,
                view: 'case-transations'
              }
            }
          }
        },
        { provide: Router, useValue: routerMock1 },
        {
          provide: IdamDetails,
          useValue: new IdamDetails(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        },
        { provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
         }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    idamDetails = fixture.debugElement.injector.get(IdamDetails);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);

  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Component variable should get correct value based on parameter', () => {
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);

    component.ngOnInit();
    component.lsCcdNumber = '1111-2222-3333-4441';
    component.ccdCaseNumber = '1111-2222-3333-4444';
    component.checkValidUser();

    expect(component.cardPaymentReturnUrl).toBe(undefined);
    // expect(component.view).toBe('case-transations');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.takePayment).toBeTruthy();
  });
});

describe('Payment History component case-transations', () => {
  let component: PaymentHistoryComponent,
    fixture: ComponentFixture<PaymentHistoryComponent>,
    idamDetails: IdamDetails,
    paymentGroupService: PaymentGroupService;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ ccdCaseNumber: '1111-2222-3333-4444' }),
          snapshot: {
            queryParams: {
              takePayment: true,
              view: 'case-transations'
            }
          }
        }
      },
      { provide: Router, useValue: routerMock },
      { provide: PaymentGroupService ,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: IdamDetails,
        useValue: new IdamDetails(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: PaymentGroupService,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    idamDetails = fixture.debugElement.injector.get(IdamDetails);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Component variable should get correct value based on parameter', () => {
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);
    component.ngOnInit();

    expect(component.cardPaymentReturnUrl).toBe(undefined);
    //  expect(component.view).toBe('case-transations');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.takePayment).toBeTruthy();
  });
});

describe('Payment History component fee-summary', () => {
  let component: PaymentHistoryComponent,
    fixture: ComponentFixture<PaymentHistoryComponent>,
    idamDetails: IdamDetails,
    paymentGroupService: PaymentGroupService;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ ccdCaseNumber: '1111-2222-3333-4444', view: '' }),
          snapshot: {
            queryParams: { view: 'fee-summary', paymentGroupRef: '123' }
          }
        }
      },
      { provide: Router, useValue: routerMock },
      { provide: PaymentGroupService ,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: IdamDetails,
        useValue: new IdamDetails(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: PaymentGroupService,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      } ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    idamDetails = fixture.debugElement.injector.get(IdamDetails);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('make sure the ngOnInit assign variables from activatedRoute', async () => {
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    //  expect(component.view).toBe('fee-summary');
    expect(component.paymentGroupRef).toBe('123');
    expect(component.apiRoot).toBe('api/payment-history');
  });

  it('check if queryparam is undefined or not activatedRoute', async () => {
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    //  expect(component.view).toBe('fee-summary');
    expect(component.paymentGroupRef).toBe('123');
    expect(component.apiRoot).toBe('api/payment-history');
  });
});

describe('Payment History component Reports', () => {
  let component: PaymentHistoryComponent,
    fixture: ComponentFixture<PaymentHistoryComponent>,
    idamDetails: IdamDetails,
    paymentGroupService: PaymentGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ view: 'reports' }),
          snapshot: {
            queryParams: { view: '' }
          }
        }
      },
      { provide: Router, useValue: routerMock },
      { provide: PaymentGroupService,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: IdamDetails,
        useValue: new IdamDetails(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      },
      {
        provide: PaymentGroupService,
        useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    idamDetails = fixture.debugElement.injector.get(IdamDetails);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('make sure the ngOnInit assign variables from activatedRoute', async () => {
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.view).toBe('');
    expect(component.bulkscanapiRoot).toBe('api/bulk-scan');
  });

  it('check if queryparam is undefined or not activatedRoute', async () => {
    spyOn(idamDetails, 'getUserRoles').and.callFake(() => new BehaviorSubject(roles));
    spyOn(paymentGroupService, 'getEnvironment').and.callFake(() => Promise.resolve('demo'));
    spyOn(paymentGroupService, 'getLDFeature').and.callFake(async () => true);

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.view).toBe('');
    expect(component.bulkscanapiRoot).toBe('api/bulk-scan');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
