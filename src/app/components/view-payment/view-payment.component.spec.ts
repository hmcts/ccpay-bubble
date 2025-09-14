import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { ViewPaymentComponent } from './view-payment.component';

describe('View payment component', () => {
  let component: ViewPaymentComponent;
  let fixture: ComponentFixture<ViewPaymentComponent>;
  let testBedService: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ViewPaymentComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ ref: '1111-2222-3333-4444' })
            }
        },
        HttpClient,
        provideHttpClient(withInterceptorsFromDi())
    ]
});

    fixture = TestBed.createComponent(ViewPaymentComponent);
    component = fixture.componentInstance;

    testBedService = TestBed.inject(ActivatedRoute);
  });

  it('Should get route param payment references', () => {
    component.getPaymentRef().subscribe(paymentReference => {
      expect(paymentReference).toBe('1111-2222-3333-4444');
    });
  });

  it('Should set paymentRef on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.paymentRef).toBe('1111-2222-3333-4444');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
