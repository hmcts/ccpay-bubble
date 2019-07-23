import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaymentHistoryComponent } from './payment-history.component';

describe('Payment History component', () => {
  let component: PaymentHistoryComponent,
  fixture: ComponentFixture<PaymentHistoryComponent>;

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
