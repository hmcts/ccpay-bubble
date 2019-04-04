import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { FeeModel } from 'src/app/models/FeeModel';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent {
  fee: FeeModel = this.addFeeDetailService.selectedFee;
  payBubbleView?: SafeHtml;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService,
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
          this.navigateToConfirmation();
        })
        .catch(err => {
          this.navigateToServiceFailure();
        });
    } else {
      this.addFeeDetailService.postPayment()
        .then(response => {
          this.payBubbleView = response;
        })
        .catch(err => {
          this.navigateToServiceFailure();
        });
    }
  }

  navigateToServiceFailure() {
    this.router.navigate(['/service-failure']);
  }

  navigateToConfirmation() {
    this.router.navigate(['/confirmation']);
  }

  onGoBack() {
    return this.router.navigate(['/addFeeDetail']);
  }
}
