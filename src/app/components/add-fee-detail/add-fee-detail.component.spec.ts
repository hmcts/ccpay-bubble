import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddFeeDetailComponent } from './add-fee-detail.component';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentModel } from '../../models/PaymentModel';
import { instance, mock, spy } from 'ts-mockito';
import { Meta } from '@angular/platform-browser';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { of } from 'rxjs';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('AddFeeDetailComponent', () => {
  let addFeeDetailsService: AddFeeDetailService;
  let component: AddFeeDetailComponent;
  let http: PaybubbleHttpClient;
  let fixture: ComponentFixture<AddFeeDetailComponent>;
  let caseRefService: CaseRefService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeeDetailComponent ],
      providers: [
        PaybubbleHttpClient,
        AddFeeDetailService,
        CaseRefService,
        FormBuilder,
        { provide: Router, useValue: routerMock }
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule.withRoutes([])],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeeDetailComponent);
    component = fixture.componentInstance;
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should reset selected fee on init', () => {
    const service = fixture.debugElement.injector.get(AddFeeDetailService);
    expect(service.selectedFee).toBe(null);
  });

  it('Should set savedFee if a selected fee exists', () => {
    const paymentModel = new PaymentModel(),
    feeModel = new FeeModel(),
    service = fixture.debugElement.injector.get(AddFeeDetailService);
    addFeeDetailsService = new AddFeeDetailService(http);
    paymentModel.ccd_case_number = '1111-1111-1111-1111';
    paymentModel.service = 'DIVROCE';
    feeModel.code = 'FEE0123';
    feeModel.volume = 1;
    service.selectedFee = feeModel;
    service.paymentModel = paymentModel;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.savedFee).toBe(feeModel);
  });

  it('Should pre populate form values if a fee has been pre selected', () => {
    const paymentModel = new PaymentModel(),
    feeModel = new FeeModel(),
    service = fixture.debugElement.injector.get(AddFeeDetailService);
    addFeeDetailsService = new AddFeeDetailService(http);
    paymentModel.ccd_case_number = '1111-1111-1111-1111';
    paymentModel.service = 'Divorce';
    feeModel.code = 'FEE0123';
    feeModel.volume = 1;
    service.selectedFee = feeModel;
    service.paymentModel = paymentModel;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.feeDetailForm.controls['serviceType'].value).toBe(paymentModel.service);
    expect(component.feeDetailForm.controls['caseReference'].value).toBe(paymentModel.ccd_case_number);
    expect(component.feeDetailForm.controls['selectedFee'].value).toBe(feeModel);
  });

  it('Should toggle help with fees', () => {
    component.helpWithFeesIsVisible = false;
    component.toggleHelpWithFees();
    expect(component.helpWithFeesIsVisible).toBeTruthy();
  });

  it('Should select a fee', () => {
    const fee: FeeModel = new FeeModel;
    component.selectFee(fee);
    fixture.detectChanges();
    expect(component.selectedFee).toEqual(fee);
  });

  describe('Fee form validation', () => {
    it('Validation errors should exist if a CCD case reference is not provided', () => {
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if a CCD case reference is too long', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if a CCD case reference is too short', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if a CCD case reference is in an incorrect format', () => {
      component.feeDetailForm.controls['caseReference'].setValue('111111111111-2222');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if an HWF code is entered but not an HWF ammount', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      component.feeDetailForm.get('helpWithFees.code').setValue('HWF-123-123');
      component.setHelpWithFeesGroupValidation();
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if an HWF amount is entered but not an HWF code', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      component.feeDetailForm.get('helpWithFees.amount').setValue(0);
      component.setHelpWithFeesGroupValidation();
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if an HWF amount is negative', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      component.feeDetailForm.get('helpWithFees.amount').setValue(-10);
      component.setHelpWithFeesGroupValidation();
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should exist if an HWF amount is greater than selected fee amount', () => {
      const fee: FeeModel = new FeeModel;
      fee.calculated_amount = 20;
      component.selectedFee = fee;
      fixture.detectChanges();
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      component.setHelpWithFeesAmountValidation();
      component.feeDetailForm.get('helpWithFees.code').setValue('HWF-123-123');
      component.feeDetailForm.get('helpWithFees.amount').setValue(30);
      component.saveAndContinue();
      expect(component.feeDetailForm.invalid).toBe(true);
    });

    it('Validation errors should not show if no validation errors exist', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(true);
      const fee: FeeModel = new FeeModel;
      fee.calculated_amount = 20.00;
      component.selectedFee = fee;
      fixture.detectChanges();
      component.saveAndContinue();
      fixture.detectChanges();
      expect(component.showErrors).toBe(false);
    });

    it('Validation errors should show if form builder validation errors exist', () => {
      component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111');
      component.feeDetailForm.controls['selectedFee'].setValue(false);
      component.saveAndContinue();
      fixture.detectChanges();
      expect(component.showErrors).toBe(true);
    });
  });

  it('Saving and continuing should commit a selected fee to the service', async() => {
    const fee: FeeModel = new FeeModel,
      service = fixture.debugElement.injector.get(AddFeeDetailService);
    spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
    fee.calculated_amount = 20.00;
    component.selectedFee = fee;
    component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
    component.feeDetailForm.controls['selectedFee'].setValue(true);
    fixture.detectChanges();
    await component.saveAndContinue();
    await fixture.whenStable();
    expect(service.selectedFee).toBe(fee);
  });

  it('Saving add fee detail should navigate to review fee detail page', async() => {
    const fee: FeeModel = new FeeModel;
    fee.calculated_amount = 20.00;
    spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
    component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
    component.feeDetailForm.controls['selectedFee'].setValue(true);
    component.selectFee(fee);
    fixture.detectChanges();
    await component.saveAndContinue();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/reviewFeeDetail');
  });

  it('On partial remission, net_amount should be set', async() => {
    const fee: FeeModel = new FeeModel,
    service = fixture.debugElement.injector.get(AddFeeDetailService);
  spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
  fee.calculated_amount = 20.00;
  component.selectedFee = fee;
  component.feeDetailForm.controls['caseReference'].setValue('1111-1111-1111-1111');
  component.feeDetailForm.controls['selectedFee'].setValue(true);
  component.feeDetailForm.get('helpWithFees.amount').setValue(30);
  fixture.detectChanges();
  await component.saveAndContinue();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(component.selectedFee.net_amount).toBe(30);
  });

  it('Restore the add fee details page values',  () => {
    const paymentModel = new PaymentModel(),
      feeModel = new FeeModel(),
      service = fixture.debugElement.injector.get(AddFeeDetailService);

    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailsService = new AddFeeDetailService(http);
    paymentModel.ccd_case_number = '1111-1111-1111-1111';
    paymentModel.service = 'DIVROCE';
    feeModel.code = 'FEE0123';
    feeModel.volume = 1;
    service.selectedFee = feeModel;
    service.paymentModel = paymentModel;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.selectedFee).toBe(feeModel);
  });
});
