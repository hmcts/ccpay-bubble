import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AddFeeDetailComponent } from './add-fee-detail.component';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { FeeModel } from 'src/app/models/FeeModel';
import { feeTypes } from '../../../stubs/feeTypes';
import { Router } from '@angular/router';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('AddFeeDetailComponent', () => {
  let component: AddFeeDetailComponent;
  let fixture: ComponentFixture<AddFeeDetailComponent>;
  let feeDataCount = 0;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeeDetailComponent ],
      providers: [
        PaybubbleHttpClient,
        AddFeeDetailService,
        { provide: Router, useValue: routerMock }
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        RouterModule,
        RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.buildFeeList(feeTypes);
    feeDataCount = component.feeModels.length;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should toggle help with fees', () => {
    component.hwfEntryOn = false;
    component.toggleHwfFields();
    expect(component.hwfEntryOn).toBeTruthy();
  });

  it('Should toggle the checked state of a fee', () => {
    const fee: FeeModel = new FeeModel;
    fee.checked = false;
    component.selectPaymentInstruction(fee);
    expect(fee.checked).toBeTruthy();
  });

  it('Should populate the fee list with fee data', () => {
    expect(component.feeModels.length).toBe(feeDataCount);
  });

  it('Should add fee model code when populating fee list', () => {
    expect(component.feeModels[0].code).toBe('FEE0002');
  });

  it('Should add fee model versions when populating fee list', () => {
    expect(component.feeModels[0].calculated_amount).toBe(550.00);
    expect(component.feeModels[0].display_amount).toBe('£ 550.00');
    expect(component.feeModels[0].description).toBe('Filing an application for a divorce, nullity or civil partnership dissolution');
    expect(component.feeModels[0].version).toBe('4');
  });

  it('Should filter an array of fee models for selected fees only', () => {
    component.selectPaymentInstruction(component.feeModels[0]);
    expect(component.filterSelectedFees().length).toBe(1);
  });

  it('Should update the pay model with a selected fee', () => {
    const selectedFee = component.feeModels[0];
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.payModel.fees[0]).toEqual(selectedFee);
  });

  it('Should populate the paymodel amount propertry with a selected fee', () => {
    const selectedFee = component.feeModels[0];
    selectedFee.calculated_amount = 10.00;
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.payModel.amount).toEqual(10.00);
  });

  it('Should update the remission model with a selected fee', () => {
    const selectedFee = component.feeModels[0];
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.remissionModel.fee).toEqual(selectedFee);
  });

  it('Should populate the remission hwf amount propertry with a selected fee', () => {
    const amountToPay = 2.00;
    const selectedFee = component.feeModels[0];
    component.amount_to_pay = amountToPay;
    selectedFee.calculated_amount = 10.00;
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.remissionModel.hwf_amount).toEqual(8.00);
  });

  it('Should set remission hwf amount propertry to null if amount to pay is not set', () => {
    const selectedFee = component.feeModels[0];
    component.amount_to_pay = null;
    selectedFee.calculated_amount = 10.00;
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.remissionModel.hwf_amount).toEqual(null);
  });

  it('Saving add fee detail should navigate to review fee detail page', () => {
    component.selectPaymentInstruction(component.feeModels[0]);
    component.saveAndContinue();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/reviewFeeDetail');
  });
});
