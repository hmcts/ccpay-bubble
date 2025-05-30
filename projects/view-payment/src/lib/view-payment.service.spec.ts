import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ViewPaymentService } from './view-payment.service';

describe('PaymentLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        ViewPaymentService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
});
  });

  it('should be created', inject([ViewPaymentService], (service: ViewPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
