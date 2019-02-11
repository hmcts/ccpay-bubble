import { Component } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { Router } from '@angular/router';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {
  helpWithFeesIsVisible = false;
  fees: FeeModel[] = this.addFeeDetailService.buildFeeList();

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService
  ) { }

  ngOnInit() {
    this.addFeeDetailService.reset();
  }

  get serviceType() {
    return this.addFeeDetailService.serviceType;
  }

  set serviceType(serviceType: string) {
    this.addFeeDetailService.serviceType = serviceType;
  }

  set helpWithFeesCode(helpWithFeesCode: string) {
    this.addFeeDetailService.helpWithFeesCode = helpWithFeesCode;
  }

  set caseReference(caseRef: string) {
    this.addFeeDetailService.caseReference = caseRef;
  }

  set amountToPay(amountToPay: number) {
    this.addFeeDetailService.amountToPay = amountToPay;
  }

  toggleHelpWithFees() {
    this.helpWithFeesIsVisible = !this.helpWithFeesIsVisible;
  }

  saveAndContinue() {
    this.addFeeDetailService.setNewPaymentModel();
    this.addFeeDetailService.setNewRemissionModel();
    this.router.navigateByUrl('/reviewFeeDetail');
  }

  selectFee(fee: FeeModel) {
    this.addFeeDetailService.selectedFee = fee;
  }
}
