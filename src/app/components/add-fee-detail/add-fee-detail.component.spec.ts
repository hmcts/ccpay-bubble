import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AddFeeDetailComponent } from './add-fee-detail.component';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { FeeModel } from 'src/app/models/FeeModel';
import { feeData as mockFeeDate } from '../../../stubs/feeData';
import { Router } from '@angular/router';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('AddFeeDetailComponent', () => {
  let component: AddFeeDetailComponent;
  let fixture: ComponentFixture<AddFeeDetailComponent>;
  let feeDataCount = 0;
  let mockAddFeeDetailService: any;

  beforeEach(async(() => {
    mockAddFeeDetailService = jasmine.createSpyObj<AddFeeDetailService>('addFeeDetailService', ['saveAndContinue']);
    TestBed.configureTestingModule({
      declarations: [ AddFeeDetailComponent ],
      providers: [
        PaybubbleHttpClient,
        { provide: AddFeeDetailService, useValue: mockAddFeeDetailService },
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
    component.buildFeeList(mockFeeDate);
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

  it('Should update the remission model with a selected fee', () => {
    const selectedFee = component.feeModels[0];
    component.selectPaymentInstruction(selectedFee);
    component.saveAndContinue();
    expect(component.remissionModel.fee).toEqual(selectedFee);
  });

  it('Saving add fee detail should navigate to review fee detail page', () => {
    component.selectPaymentInstruction(component.feeModels[0]);
    component.saveAndContinue();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/reviewFeeDetail');
  });
});
