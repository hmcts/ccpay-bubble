import { Component, OnInit } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent implements OnInit {

  feeModels = FeeModel.models;
  payModel = PaymentModel.model;
  remissionModel = RemissionModel.model;
  display_fee_amount: string;
  display_amount_to_pay: string;
  paymentReference = '';
  paymentGroupReference = '';
  error: string;
  resultData: any;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService
  ) { }

  ngOnInit() {
    this.setDisplayAmounts();
  }

  setDisplayAmounts() {
    this.display_amount_to_pay = '£ ' + parseFloat(this.payModel.amount + '').toFixed(2);
    this.display_fee_amount = '£ ' + parseFloat((this.feeModels) ? this.feeModels[0].calculated_amount + '' : '').toFixed(2);
  }

  sendPayDetailsToPayhub() {
    this.addFeeDetailService.sendPayDetailsToPayhub(PaymentModel.cleanModel(this.payModel))
    .then(sendCardPayments => {
      this.resultData = JSON.parse(sendCardPayments);
      this.paymentReference = this.resultData.data.reference;
      this.paymentGroupReference = this.resultData.data.payment_group_reference;
    })
    .catch(err => {
      this.error = err;
    });
  }

  onGoBack() {
    return this.router.navigateByUrl('/addFeeDetail');
  }
}
