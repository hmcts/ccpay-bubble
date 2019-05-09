import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { XHRBackend, Response, ResponseOptions } from '@angular/http';
import { ViewPaymentService } from './view-payment.service';

describe('PaymentLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ViewPaymentService,
      ]
    });
  });

  it('should be created', inject([ViewPaymentService], (service: ViewPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
