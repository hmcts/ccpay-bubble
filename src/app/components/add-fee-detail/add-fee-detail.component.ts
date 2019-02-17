import { Component, OnInit } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stringLengthValidator, helpWithFeesValidator, isLessThanAmountValidator } from 'src/app/shared/validators';

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

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.addFeeDetailService.selectedFee = null;

    this.feeDetailForm = this.formBuilder.group({
      serviceType: ['DIVORCE', Validators.required],
      caseReference: ['', Validators.compose([Validators.required, stringLengthValidator(16)])],
      selectedFee: [false, Validators.required],
      helpWithFees: this.formBuilder.group({
        code: [''],
        amount: [null]
      })
    });
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
  }

  setHelpWithFeesAmountValidation() {
    this.feeDetailForm.patchValue({selectedFee: true});
    const hwfAmountControl = this.feeDetailForm.get('helpWithFees.amount');
    hwfAmountControl.setValidators(isLessThanAmountValidator(this.selectedFee.calculated_amount));
    hwfAmountControl.updateValueAndValidity();
  }

  setHelpWithFeesValidation() {
    const helpWithFeesGroup = this.feeDetailForm.get('helpWithFees');
    helpWithFeesGroup.setValidators(helpWithFeesValidator);
    helpWithFeesGroup.updateValueAndValidity();
  }
}
