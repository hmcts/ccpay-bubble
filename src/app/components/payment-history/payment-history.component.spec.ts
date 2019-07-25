import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { PaymentHistoryComponent } from './payment-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, of } from 'rxjs';

describe('PaymentHistoryComponent', () => {
  let component: PaymentHistoryComponent;
  let fixture: ComponentFixture<PaymentHistoryComponent>;
  let activatedRoute: ActivatedRoute;
  let params: Subject<Params>;

  beforeEach(async(() => {
    params = new Subject<Params>();
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    params.next({'ccdCaseNumber': '1111-2222-3333-4444'});
    activatedRoute.params.subscribe((p) => {
      component.ccdCaseNumber = p['ccdCaseNumber'];
      component.apiRoot = 'api/payment-history';
      fixture.detectChanges();
      expect(component.apiRoot).toBe('api/payment-history');
      expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    });
  });

   it('Component variable should get correct value based on parameter', () => {
    component.ngOnInit();

    expect(component.apiRoot).toBe('api/payment-history');
    expect(component.view).toBe('case-transations');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
    expect(component.takePayment).toBe(true);
  });
});
