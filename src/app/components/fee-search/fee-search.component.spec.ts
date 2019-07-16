import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FeeSearchComponent} from './fee-search.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {MockPaymentGroupService} from '../../../../projects/fee-register-search/src/lib/mocks/mock-payment-group-service';
import {mockPaymentGroup} from '../../../../projects/fee-register-search/src/lib/mocks/mock-payment-group';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
    fixture: ComponentFixture<FeeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      providers: [
        {provide: PaymentGroupService, useClass: MockPaymentGroupService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should assign selected fee', () => {
    component.selectFee('test');
    fixture.detectChanges();
    expect(component.selectedFee).toBe('test');
  });

  it('Should post request to payhub API and assign a payment group reference', () => {
    component.selectFee('dummy');
    component.ccdNo = '1234-1234-1234-1234';
    fixture.detectChanges();
    expect(component.paymentGroupRef).toBe(mockPaymentGroup.payment_group_reference);
  });
});
