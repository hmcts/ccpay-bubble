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
  const res = {
    response: {
      body: true,
      success: true
    }
  };

  beforeEach(async(() => {
    mockAddFeeDetailService = jasmine.createSpyObj<AddFeeDetailService>('addFeeDetailService', ['sendPayDetailsToPayhub']);
    TestBed.configureTestingModule({
      imports: [ RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ReviewFeeDetailComponent ],
      providers: [
        { provide: AddFeeDetailService, useValue: mockAddFeeDetailService },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set amount to pay from the payment model', () => {
    expect(component.display_amount_to_pay).toContain(`${PaymentModel.model.amount}`);
  });

  it('Should set fee amount from the fee model', () => {
    expect(component.display_amount_to_pay).toContain(`${FeeModel.models[0].calculated_amount}`);
  });

  it('It should navigate back to the add fee details page', () => {
    component.onGoBack();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/addFeeDetail');
  });
});
