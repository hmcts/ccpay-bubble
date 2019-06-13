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

  constructor(private activatedRoute: ActivatedRoute,
              private location: PlatformLocation,
              private router: Router) {
    location.onPopState(() => {
      console.log('Browser back button clicked');
      console.log('Url params: ', router.parseUrl(router.url));
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.apiRoot = 'api/payment-history';
      this.ccdCaseNumber = params['ccdCaseNumber'];
    });
  }

}
