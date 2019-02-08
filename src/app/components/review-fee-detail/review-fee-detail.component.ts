import { Component } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { IResponse } from 'src/app/interfaces/response';
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
  paymentReference = '';
  redirectUrl = '';

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
    this.addFeeDetailService.sendPayDetailsToPayhub().subscribe((response: IResponse) => {
      if (!response.data && response.success) { return this.router.navigateByUrl('/api/addFeeDetail'); }
    });
  }

  onGoBack() {
    return this.router.navigateByUrl('/addFeeDetail');
  }
}
