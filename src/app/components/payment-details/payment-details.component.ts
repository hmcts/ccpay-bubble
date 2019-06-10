import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CaseSearchComponent} from '../case-search/case-search.component';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  paymentApiRoot: string;
  ccdCaseNumber: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.paymentApiRoot = 'http://localhost:8080';
    this.ccdCaseNumber = '1111-2222-3333-4444';
  }
}
