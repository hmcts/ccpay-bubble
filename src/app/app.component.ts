import { Component } from '@angular/core';
import { pluck, map, filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
declare var gtag;
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent {
 title = 'ccpay-bubble';
 constructor (
   private router: Router,
   private activatedRoute: ActivatedRoute
   ) {
   const navEndEvents = router.events.pipe (
     filter(event => event instanceof NavigationEnd)
   );
   navEndEvents.subscribe((event: NavigationEnd) => {
     gtag('config', 'UA-146285829-2', {'page_path': event.urlAfterRedirects} );
   });
   }
}
