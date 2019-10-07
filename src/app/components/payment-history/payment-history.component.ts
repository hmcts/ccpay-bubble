import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  apiRoot: string;
  bulkscanapiRoot: string;
  view: string;
  takePayment: boolean;
  ccdCaseNumber: string;
  paymentGroupRef: string;
  dcnNumber: string;
  selectedOption: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
      this.activatedRoute.params.subscribe((params) => {
      this.apiRoot = 'api/payment-history';
      this.bulkscanapiRoot = 'api/bulk-scan';
      this.ccdCaseNumber = params['ccdCaseNumber'];
      this.view = this.activatedRoute.snapshot.queryParams['view'] !== undefined ?
      this.activatedRoute.snapshot.queryParams['view'] : params['view'];
      this.takePayment = this.activatedRoute.snapshot.queryParams['takePayment'];
      this.paymentGroupRef = this.activatedRoute.snapshot.queryParams['paymentGroupRef'];
      this.dcnNumber = this.activatedRoute.snapshot.queryParams['dcn'];
      this.selectedOption = this.activatedRoute.snapshot.queryParams['selectedOption'];
    });
  }
}
