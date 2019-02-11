import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { HttpClientModule } from '@angular/common/http';
import { compare } from 'semver';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { FormatDisplayCurrencyPipe } from 'src/app/shared/pipes/format-display-currency.pipe';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('ReviewFeeDetailComponent', () => {
  let component: ReviewFeeDetailComponent;
  let fixture: ComponentFixture<ReviewFeeDetailComponent>;
  const payModel = new PaymentModel();
  payModel.amount = 10.00;
  const remissionModel = new RemissionModel();
  remissionModel.hwf_reference = '123';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFeeDetailComponent, FormatDisplayCurrencyPipe],
      providers: [
        PaybubbleHttpClient,
        AddFeeDetailService,
        { provide: Router, useValue: routerMock }
      ],
      imports: [
        HttpClientModule,
        RouterModule,
        RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFeeDetailComponent);
    component = fixture.componentInstance;
    const selectedFee = new FeeModel();
    selectedFee.calculated_amount = 100;
    const service = fixture.debugElement.injector.get(AddFeeDetailService);
    service.paymentModel = payModel;
    service.remissionModel = remissionModel;
    component.fee = selectedFee;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should GET paymodel', () => {
    expect(component.payModel).toEqual(payModel);
  });

  it('Should GET remissionModel', () => {
    expect(component.remissionModel).toEqual(remissionModel);
  });

  it('It should navigate back to the add fee details page', () => {
    component.onGoBack();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/addFeeDetail');
  });
});
