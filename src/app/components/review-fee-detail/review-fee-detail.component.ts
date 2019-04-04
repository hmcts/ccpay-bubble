import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { FeeModel } from 'src/app/models/FeeModel';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent {
  fee: FeeModel = this.addFeeDetailService.selectedFee;
  response?: any;

  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService,
    private sanitizer: DomSanitizer
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
        this.navigateToServiceFailure();
       });
    } else {
      this.addFeeDetailService.postPayment()
      .then(response => {
        console.log('here');
        console.log(response);
        this.redirectURL = response;
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
