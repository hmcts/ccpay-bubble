import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';

declare var gtag;
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
   private activatedRoute: ActivatedRoute,
   private paymentGroupService: PaymentGroupService
   ) {
   const navEndEvents = router.events.pipe (
     filter(event => event instanceof NavigationEnd)
   );
   navEndEvents.subscribe((event: NavigationEnd) => {
     gtag('config', 'UA-146285829-2', {'page_path': event.urlAfterRedirects} );
   });
   }
   ngOnInit() {
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });
  }
}
