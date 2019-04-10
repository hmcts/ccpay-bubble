import { TestBed } from '@angular/core/testing';
import { ViewPaymentService } from './view-payment.service';

describe('ViewPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewPaymentService = TestBed.get(ViewPaymentService);
    expect(service).toBeTruthy();
  });
});
