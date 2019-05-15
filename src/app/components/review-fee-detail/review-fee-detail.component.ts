import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { FeeModel } from 'src/app/models/FeeModel';
import { SafeHtml } from '@angular/platform-browser';
import { reference } from '@angular/core/src/render3';
import { RemissionResponseModel } from 'src/app/models/ResponseModel';

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
    private addFeeDetailService: AddFeeDetailService
  ) { }

  get payModel() {
    return this.addFeeDetailService.paymentModel;
  }

  get remissionModel() {
    return this.addFeeDetailService.remissionModel;
  }

  sendPayDetailsToPayhub() {
    console.log(this.payModel);
    if (this.payModel.amount === 0) {
      this.addFeeDetailService.postFullRemission()
      .then(response => {
        console.log('FULL REMISSION RESPONSE');
        console.log(response);
        const remissionData: RemissionResponseModel = response.data;
        this.addFeeDetailService.remissionRef = remissionData.remission_reference;
        this.router.navigate(['/confirmation']);
      })
      .catch(err => {
        this.navigateToServiceFailure();
       });
    } else if (this.fee.calculated_amount > this.payModel.amount) {
      this.addFeeDetailService.postPartialPayment()
      .then(response => {
        console.log('PARTIAL REMISSION PAYMENT RESPONSE');
        console.log(response);
        const respData = JSON.parse(response).data;
        this.addFeeDetailService.postPartialRemission(respData.payment_group_reference, respData.fees[0].id)
        .then(remissionResponse => {
          console.log('PARTIAL REMISSION RESPONSE');
          console.log(remissionResponse);
          this.addFeeDetailService.remissionRef = remissionResponse.case_reference;
          this.router.navigate(['/confirmation']);
        })
        .catch(err => {
          this.navigateToServiceFailure();
        });
      })
      .catch(err => {
        this.navigateToServiceFailure();
       });
    } else {
      this.addFeeDetailService.postPayment()
      .then(response => {
        console.log('FULL POST PAYMENT RESPONSE');
        console.log(response);
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

  onGoBack() {
    return this.router.navigate(['/addFeeDetail']);
  }
}
