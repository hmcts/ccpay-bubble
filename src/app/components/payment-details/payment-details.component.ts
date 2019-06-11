import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  paymentApiRoot: string;
  ccdCaseNumber: string;

  constructor() { }

  ngOnInit() {
    this.paymentApiRoot = 'api/payments-history';
    this.ccdCaseNumber = '1111-2222-3333-4444';
  }
}
