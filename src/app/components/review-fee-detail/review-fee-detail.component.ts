import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { RemissionModel } from 'src/app/models/RemissionModel';

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


  constructor(private location: Location) { }

  ngOnInit() {
    this.setDisplayAmounts();
  }

  private setDisplayAmounts() {
    this.display_amount_to_pay = '£ ' + parseFloat(this.payModel.amount + '').toFixed(2);
    this.display_fee_amount = '£ ' + parseFloat((this.feeModels) ? this.feeModels[0].calculated_amount + '' : '').toFixed(2);
  }

  onGoBack() {
    return this.location.back();
  }

}
