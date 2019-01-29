import { Component, OnInit } from '@angular/core';
import { CaseFeeModel } from 'src/app/models/CaseFeeModel';
import { Location } from '@angular/common';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent implements OnInit {

  caseFeeModel = CaseFeeModel.model;
  feeModels = FeeModel.models;
  payModel = PaymentModel.model;

  constructor(private location: Location) { }

  ngOnInit() {
  }

  onGoBack() {
    return this.location.back();
  }

}
