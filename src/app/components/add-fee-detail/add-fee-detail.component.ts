import { Component, OnInit} from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ccdCaseRefPatternValidator, helpWithFeesValidator, isLessThanAmountValidator } from 'src/app/shared/validators';
import { PaymentModel } from '../../models/PaymentModel';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {
  helpWithFeesIsVisible = false;
  showErrors = false;
  fees: FeeModel[] = this.addFeeDetailService.buildFeeList();
  feeDetailForm: FormGroup;
  selectedFee: FeeModel;
  savedFee?: FeeModel;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.selectedFee = this.addFeeDetailService.selectedFee;
    const payment: PaymentModel = this.addFeeDetailService.paymentModel;

    if (this.selectedFee) {
      this.savedFee = this.selectedFee;

      this.feeDetailForm = this.formBuilder.group({
        serviceType: [payment.service, Validators.required],
        caseReference: [payment.ccd_case_number, Validators.compose([Validators.required, ccdCaseRefPatternValidator()])],
        selectedFee: [this.selectedFee, Validators.required],
        helpWithFees: this.formBuilder.group({
          code: [''],
          amount: [null]
        })
      });
    } else {
      this.addFeeDetailService.selectedFee = null;

      this.feeDetailForm = this.formBuilder.group({
        serviceType: ['DIVORCE', Validators.required],
        caseReference: ['', Validators.compose([Validators.required, ccdCaseRefPatternValidator()])],
        selectedFee: [null, Validators.required],
        helpWithFees: this.formBuilder.group({
          code: [''],
          amount: [null]
        })
      });
    }
  }

  toggleHelpWithFees() {
    this.helpWithFeesIsVisible = !this.helpWithFeesIsVisible;
  }

  saveAndContinue() {
    if (this.feeDetailForm.invalid) { return this.showErrors = true; }
    this.showErrors = false;

    const feeDetailProps = {
      serviceType: this.feeDetailForm.get('serviceType').value,
      helpWithFeesCode: this.feeDetailForm.get('helpWithFees.code').value,
      caseReference: this.feeDetailForm.get('caseReference').value,
      amountToPay: this.feeDetailForm.get('helpWithFees.amount').value
    };

    this.addFeeDetailService.selectedFee = this.selectedFee;
    this.addFeeDetailService.setNewPaymentModel(feeDetailProps);
    this.addFeeDetailService.setNewRemissionModel(feeDetailProps);
    this.router.navigateByUrl('/reviewFeeDetail');
  }

  selectFee(fee: FeeModel) {
    this.selectedFee = fee;
    this.setHelpWithFeesAmountValidation();
    this.feeDetailForm.patchValue({selectedFee: true});
  }

  setHelpWithFeesAmountValidation() {
    const hwfAmountControl = this.feeDetailForm.get('helpWithFees.amount');
    hwfAmountControl.setValidators(isLessThanAmountValidator(this.selectedFee.calculated_amount));
    hwfAmountControl.updateValueAndValidity();
  }

  setHelpWithFeesGroupValidation() {
    const hwfGroup = this.feeDetailForm.get('helpWithFees');
    hwfGroup.setValidators(helpWithFeesValidator);
    hwfGroup.updateValueAndValidity();
  }
}
