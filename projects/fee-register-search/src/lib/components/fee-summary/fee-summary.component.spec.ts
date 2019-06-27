import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FeeSummaryComponent } from './fee-summary.component';
import { FeeRegisterSearchService } from '../../services/fee-register-search/fee-register-search.service';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { HttpClientModule } from '@angular/common/http';
import { mockPaymentGroup } from '../../mocks/mock-payment-group';
import { mockFees } from '../../mocks/mock-fees';

describe('Fee Summary component', () => {
  let component: FeeSummaryComponent,
  fixture: ComponentFixture<FeeSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeSummaryComponent],
      providers: [FeeRegisterSearchService, PaymentGroupService],
      imports: [
        CommonModule,
        HttpClientModule
      ],
    });

    fixture = TestBed.createComponent(FeeSummaryComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should return correct getRemissionByFeeCode', () => {
    component.paymentGroup = mockPaymentGroup;
    component.fees = mockFees;
    expect(component.getRemissionByFeeCode('FEE0002')).toBe(component.paymentGroup.remissions[0]);
    expect(component.getRemissionByFeeCode('FEE0001')).toBeNull();
  });

  it('Should return correct getFeeByFeeCode', () => {
    component.paymentGroup = mockPaymentGroup;
    component.fees = mockFees;
    expect(component.getFeeByFeeCode('FEE0002')).toBe(component.fees[1]);
    expect(component.getFeeByFeeCode('FEE0001')).toBe(component.fees[0]);
  });
});
