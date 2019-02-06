import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { of } from 'rxjs';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('ReviewFeeDetailComponent', () => {
  let component: ReviewFeeDetailComponent;
  let fixture: ComponentFixture<ReviewFeeDetailComponent>;
  let mockAddFeeDetailService: any;

  const payModel: PaymentModel = new PaymentModel();
  payModel.amount = 550;

  const feeModel: FeeModel = new FeeModel();
  const feeModels: FeeModel[] = [];
  feeModel.calculated_amount = 550;
  feeModels.push(feeModel);

  beforeEach(async(() => {
    mockAddFeeDetailService = jasmine.createSpyObj<AddFeeDetailService>('addFeeDetailService', ['sendPayDetailsToPayhub']);
    TestBed.configureTestingModule({
      imports: [ RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ReviewFeeDetailComponent ],
      providers: [
        { provide: AddFeeDetailService, useValue: mockAddFeeDetailService },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.feeModels = feeModels;
    component.payModel = payModel;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set amount to pay from the payment model', () => {
    component.setDisplayAmounts();
    component.payModel.amount = 550;
    expect(component.display_amount_to_pay).toContain('550');
  });

  it('Should set fee amount from the fee model', () => {
    component.setDisplayAmounts();
    component.feeModels[0].calculated_amount = 500;
    expect(component.display_amount_to_pay).toContain('550');
  });

  it('It should navigate back to the add fee details page', () => {
    component.onGoBack();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/addFeeDetail');
  });
});
