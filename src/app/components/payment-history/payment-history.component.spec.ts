import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import { PaymentHistoryComponent } from './payment-history.component';

describe('Payment History component', () => {
  let component: PaymentHistoryComponent,
  activatedRoute: ActivatedRoute,
  params: Subject<Params>,
  fixture: ComponentFixture<PaymentHistoryComponent>;

  beforeEach(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            snapshot: {
              parent: {
                params: {
                  view: 'case-transactions'
                }
              }
            }
          }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PaymentHistoryComponent);
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    params.next({ ccdCaseNumber: '1111-2222-3333-4444' });

    activatedRoute.params.subscribe((p) => {
      component.ccdCaseNumber = p['ccdCaseNumber'];
      component.view = p['view'];
      component.apiRoot = 'api/payment-history';
      fixture.detectChanges();
      expect(component.apiRoot).toBe('api/payment-history');
      expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    });
    expect(component).toBeTruthy();
  });
});
