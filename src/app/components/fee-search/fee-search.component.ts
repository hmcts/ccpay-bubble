import {Component, OnInit} from '@angular/core';
import {PaymentHistoryComponent} from '../payment-history/payment-history.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  selectedFee: any;
  ccdNo: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ccdNo = this.activatedRoute.snapshot.queryParams['ccdCaseNumber'];
    });
  }

  logFee(fee: any) {
    this.selectedFee = fee;
    console.log(fee);
  }
}
