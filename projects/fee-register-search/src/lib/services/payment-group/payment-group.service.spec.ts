import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PaymentGroupService } from './payment-group.service';

describe('PaymentGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      PaymentGroupService,
    ]
  }));

  it('should be created', inject([PaymentGroupService], (service: PaymentGroupService) => {
    expect(service).toBeTruthy();
  }));
});
