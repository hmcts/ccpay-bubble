import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
  constructor(
    private addFeeDetailService: AddFeeDetailService,
    private router: Router
  ) {}

  get paymentRef(): string {
    return this.addFeeDetailService.paymentRef;
  }

  takeNewPayment() {
    return this.router.navigateByUrl('/addFeeDetail');
  }
}
