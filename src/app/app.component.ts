import { Component, OnInit, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { DOCUMENT } from '@angular/common';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';
import { FooterComponent } from './shared/components/footer/footer.component';

declare let gtag;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CookieBannerComponent, HeaderComponent, PhaseBannerComponent, RouterOutlet, FooterComponent]
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
     gtag('config', 'UA-146285829-2', {'page_path': event.urlAfterRedirects} );
   });
   }
   ngOnInit() {
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });

    this.document.documentElement.lang = 'en';
  }
}
