import { Component, OnInit, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { DOCUMENT } from '@angular/common';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 title = 'ccpay-bubble';
 isBulkscanningEnable = true;
 constructor (
   private router: Router,
   private paymentGroupService: PaymentGroupService,
   @Inject(DOCUMENT) private document: Document
   ) {
   const navEndEvents = router.events.pipe (
     filter(event => event instanceof NavigationEnd)
   );
   navEndEvents.subscribe((event: NavigationEnd) => {
     window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
       'event': 'pageview',
       'page': event.urlAfterRedirects
     });
   });
   }
   ngOnInit() {
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });

    this.document.documentElement.lang = 'en';
  }
}
