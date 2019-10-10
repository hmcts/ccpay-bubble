import { Component } from '@angular/core';
// import { filter } from 'rxjs/operators';
// import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ccpay-bubble';
  // gtag;
  // constructor(router: Router) {
  //   const navEndEvent$ = router.events.pipe(
  //     filter(e => e instanceof NavigationEnd)
  //   );
  //   navEndEvent$.subscribe((e: NavigationEnd) => {
  //     this.gtag('config', 'UA-146285829-2', {'page_path': e.urlAfterRedirects});
  //   });
  // }
}
