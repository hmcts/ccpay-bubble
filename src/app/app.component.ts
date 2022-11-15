import { Component, OnInit, Inject } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';

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
    private paymentGroupService: PaymentGroupService,
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
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

    const appTitle = this.titleService.getTitle();

    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });

  }
}
