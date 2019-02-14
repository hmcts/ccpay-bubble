import { Component, OnInit } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {
  helpWithFeesIsVisible = false;
  fees: FeeModel[] = this.addFeeDetailService.buildFeeList();
  serviceType = 'DIVORCE';
  helpWithFeesCode = '';
  caseReference = '';
  amountToPay = null;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService
  ) { }

  ngOnInit() {
    this.addFeeDetailService.selectedFee = null;
  }

  toggleHelpWithFees() {
    this.helpWithFeesIsVisible = !this.helpWithFeesIsVisible;
  }

  saveAndContinue() {
    const feeDetailProps = {
      serviceType: this.serviceType,
      helpWithFeesCode: this.helpWithFeesCode,
      caseReference: this.caseReference,
      amountToPay: this.amountToPay
    };

    this.addFeeDetailService.setNewPaymentModel(feeDetailProps);
    this.addFeeDetailService.setNewRemissionModel(feeDetailProps);
    this.router.navigateByUrl('/reviewFeeDetail');
  }

  selectFee(fee: FeeModel) {
    this.addFeeDetailService.selectedFee = fee;
  }
}
