import {Component, OnInit} from '@angular/core';
import {PaymentHistoryComponent} from '../payment-history/payment-history.component';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  selectedFee: any;
  ccdCaseNumber: string;

  constructor(private paymentHistoryComponent: PaymentHistoryComponent) { }

  ngOnInit() {
    this.ccdCaseNumber = this.paymentHistoryComponent.ccdCaseNumber;
  }

  logFee(fee: any) {
    this.selectedFee = fee;
    console.log(fee);
  }
}
