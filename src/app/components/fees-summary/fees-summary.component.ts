import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentGroupService } from 'src/app/services/payment-group/payment-group.service';

@Component({
  selector: 'app-fees-summary',
  templateUrl: './fees-summary.component.html',
  styleUrls: ['./fees-summary.component.scss']
})
export class FeesSummaryComponent implements OnInit {

  paymentGroup: any;

  constructor(
    private router: Router,
    private paymentGroupService: PaymentGroupService
  ) {}

  ngOnInit() {
    this.paymentGroupService.getPaymentGroupByReference('').subscribe(result => {
      console.log(result);
      this.paymentGroup = result;
    });
  }

  onGoBack() {
    return this.router.navigate(['/fee-search']);
  }
}
