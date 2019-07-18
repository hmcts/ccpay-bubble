import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaymentHistoryComponent } from './payment-history.component';

describe('Payment History component', () => {
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
  });

});
