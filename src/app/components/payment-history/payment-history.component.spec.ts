import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import { PaymentHistoryComponent } from './payment-history.component';

describe('Payment History component', () => {
  let component: PaymentHistoryComponent,
  activatedRoute: ActivatedRoute,
  params: Subject<Params>,
  queryParams: Subject<Params>,
  fixture: ComponentFixture<PaymentHistoryComponent>;

  beforeEach(() => {
    params = new Subject<Params>();
    queryParams = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: params,
            snapshot: { queryParams: queryParams }
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', function () {
    expect(component).toBeTruthy();
  });

  it('Should get...', () => {
    params.next({ 'ccdCaseNumber': '1111-2222-3333-4444' });
    queryParams.next( { 'view': 'case-transactions' });

    activatedRoute.params.subscribe((p) => {
      component.ccdCaseNumber = p['ccdCaseNumber'];
      component.view = activatedRoute.snapshot.queryParams['view'];
      component.apiRoot = 'api/payment-history';
      fixture.detectChanges();
      expect(component.apiRoot).toBe('api/payment-history');
      expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    });
  });
});
