import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { FeeModel } from 'src/app/models/FeeModel';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent {
  fee: FeeModel = this.addFeeDetailService.selectedFee;
  display_fee_amount: string;
  display_amount_to_pay: string;
  resultData: any;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService
  ) { }

  get payModel() {
    return this.addFeeDetailService.paymentModel;
  }

  get remissionModel() {
    return this.addFeeDetailService.remissionModel;
  }

  sendPayDetailsToPayhub() {
    if (this.payModel.amount === 0) {
      this.addFeeDetailService.postFullRemission()
      .then(response => {
        const remissionRef = JSON.parse(response).data;
        this.addFeeDetailService.remissionRef = remissionRef;
        this.router.navigate(['/confirmation']);
      })
      .catch(err => {
        console.log(err);
        this.router.navigate(['/500']);
       });
    } else {
      this.addFeeDetailService.postPayment()
      .then(sendCardPayments => {
        this.resultData = JSON.parse(sendCardPayments);
      })
      .catch(err => {
        console.log(err);
        this.router.navigate(['/500']);
       });
    }
  }

  onGoBack() {
    return this.router.navigate(['/addFeeDetail']);
  }
}
