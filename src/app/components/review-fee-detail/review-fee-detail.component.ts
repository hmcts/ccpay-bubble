import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { FeeModel } from 'src/app/models/FeeModel';
import { SafeHtml } from '@angular/platform-browser';
import { reject } from 'q';

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
        const remissionData = JSON.parse(response).data;
        this.addFeeDetailService.remissionRef = remissionData.remission_reference;
        this.router.navigate(['/confirmation']);
      })
      .catch(err => {
        this.navigateToServiceFailure();
       });
    } else if (this.fee.calculated_amount > this.payModel.amount) {
      let paymentResp;
      this.addFeeDetailService.postPartialPayment()
      .then(response => {
        paymentResp = JSON.parse(response).data;
        console.log('PARTIAL POST card payment');
        console.log(paymentResp);
        const url = encodeURIComponent(paymentResp._links.next_url.href);
        console.log('encoded url: ');
        console.log(url);
        return this.addFeeDetailService.postPartialRemissionWithUrl(paymentResp.payment_group_reference, paymentResp.fees[0].id, url);
      // }).then(() => {
      //   const url = encodeURIComponent(paymentResp._links.next_url.href);
      //   console.log('encoded url: ');
      //   console.log(url);
      //   return this.addFeeDetailService.postPaymentUrl(url);
      }).then( urlResp => {
        console.log('then finally set pay bubble view');
        console.log(urlResp);
        this.payBubbleView = urlResp;
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

  onGoBack() {
    return this.router.navigate(['/addFeeDetail']);
  }
}
