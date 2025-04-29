import { Component, OnInit, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { DOCUMENT } from '@angular/common';
import { DynatraceService } from './services/dynatrace/dynatrace.service';
import { EnvironmentService } from './services/environments/environment.service';

declare let gtag;
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 title = 'ccpay-bubble';
 isBulkscanningEnable = true;
 constructor (
   private dynatraceService: DynatraceService,
   private router: Router,
   private paymentGroupService: PaymentGroupService,
   private environmentService: EnvironmentService,
   @Inject(DOCUMENT) private document: Document
   ) {
   const navEndEvents = router.events.pipe (
     filter(event => event instanceof NavigationEnd)
   );
   navEndEvents.subscribe((event: NavigationEnd) => {
     gtag('config', 'UA-146285829-2', {'page_path': event.urlAfterRedirects} );
   });
   }
   ngOnInit() {
     //console.log('Current Environment:', this.environmentService.getCurrentEnvironment());
     //console.log('Is Production:', this.environmentService.isProduction());
     // Add Dynatrace script when application loads
    this.dynatraceService.addDynatraceScript();
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });

    this.document.documentElement.lang = 'en';
  }
}
