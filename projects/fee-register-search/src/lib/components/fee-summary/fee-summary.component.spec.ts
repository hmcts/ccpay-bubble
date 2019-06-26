import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FeeSummaryComponent } from './fee-summary.component';
import { FeeRegisterSearchService } from '../../services/fee-register-search/fee-register-search.service';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { HttpClientModule } from '@angular/common/http';

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

});
