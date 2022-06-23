import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { CookieService } from './services/cookie/cookie.service';
import { GoogleTagManagerService } from './services/google-tag-manager/google-tag-manager.service';

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
   private paymentGroupService: PaymentGroupService,
   private  cookieService: CookieService,
   private  googleTagManagerService: GoogleTagManagerService
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
  notifyAcceptance() {
    this.googleTagManagerService.init('UA-146285829-2');
  }
  notifyRejection() {
    // AppInsights
    this.cookieService.deleteCookieByPartialMatch('ai_');
    // Google Analytics
    this.cookieService.deleteCookieByPartialMatch('_ga');
    this.cookieService.deleteCookieByPartialMatch('_gid');
    const domainElements = window.location.hostname.split('.');
    for (let i = 0; i < domainElements.length; i++) {
      const domainName = domainElements.slice(i).join('.');
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', `.${domainName}`);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', `.${domainName}`);
    }
    // DynaTrace
    this.cookieService.deleteCookieByPartialMatch('rxVisitor');
  }
}
