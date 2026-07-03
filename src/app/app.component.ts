import { Component, OnInit, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: false,
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
     const dataLayer = (window as any).dataLayer || ((window as any).dataLayer = []);
     dataLayer.push({
       event: 'virtualPageview',
       page_path: event.urlAfterRedirects
     });
   });
   }
   ngOnInit() {
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });

    this.document.documentElement.lang = 'en';

    this.loadDynatraceScript();
  }

  private loadDynatraceScript(): void {
    const meta = this.document.querySelector('meta[name="dynatrace-script-url"]');
    const url = meta ? meta.getAttribute('content') : null;
    if (!url) {
      return;
    }
    const script = this.document.createElement('script');
    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';
    this.document.head.appendChild(script);
  }
}
