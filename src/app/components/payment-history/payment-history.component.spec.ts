import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { PaymentHistoryComponent } from './payment-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, of } from 'rxjs';

describe('Payment History case transaction component', () => {
  let component: PaymentHistoryComponent,
  fixture: ComponentFixture<PaymentHistoryComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            snapshot: {
              queryParams: {
                takePayment: true,
                view: 'case-transations'
              }
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

   it('Component variable should get correct value based on parameter', () => {
    component.ngOnInit();

    expect(component.apiRoot).toBe('api/payment-history');
    expect(component.view).toBe('case-transations');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.takePayment).toBe(true);
  });
});

describe('Payment History component case-transations', () => {
  let component: PaymentHistoryComponent,
  fixture: ComponentFixture<PaymentHistoryComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [{ provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            snapshot: {
              queryParams: {
                takePayment: true,
                view: 'case-transations'
              }
            }
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Component variable should get correct value based on parameter', () => {
    component.ngOnInit();

    expect(component.apiRoot).toBe('api/payment-history');
    expect(component.view).toBe('case-transations');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.takePayment).toBe(true);
  });
});

describe('Payment History component fee-summary', () => {
  let component: PaymentHistoryComponent,
  fixture: ComponentFixture<PaymentHistoryComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
          snapshot: {
            queryParams: { view: 'fee-summary', paymentGroupRef: '123' }
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('make sure the ngOnInit assign variables from activatedRoute', async() => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.view).toBe('fee-summary');
    expect(component.paymentGroupRef).toBe('123');
    expect(component.apiRoot).toBe('api/payment-history');
  });

});

