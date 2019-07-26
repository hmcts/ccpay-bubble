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
  ccdCaseNumber: string;
  view: string;
  takePayment: boolean;
  paymentGroupRef: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.apiRoot = 'api/payment-history';
      this.ccdCaseNumber = params['ccdCaseNumber'];
      this.view = this.activatedRoute.snapshot.queryParams['view'];
      this.takePayment = this.activatedRoute.snapshot.queryParams['takePayment'];
      this.paymentGroupRef = this.activatedRoute.snapshot.queryParams['paymentGroupRef'];
    });
  }

}
