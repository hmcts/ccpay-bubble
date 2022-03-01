import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../window';
import * as cookieManager from '@hmcts/cookie-manager';

@Component({
    selector: 'app-cookie-banner',
    templateUrl: './cookie-banner.component.html',
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;
  @Output() public rejectionNotifier = new EventEmitter<any>();
  @Output() public acceptanceNotifier = new EventEmitter<any>();

isCookieBannerVisible: boolean;
  private readonly window: Window;

  constructor(
    private readonly cookieService: CookieService,
   @Inject(windowToken) window: any,
  ) {
    this.window = window as Window;
  }

  public ngOnInit(): void {
    this.isCookieBannerVisible = false;
    cookieManager.init({
      'user-preference-cookie-name': 'ccpay-bubble-cookie-preferences',
      'preference-form-id': 'cm-preference-form',
      'set-checkboxes-in-preference-form': true,
      'cookie-banner-id': 'cm-cookie-banner',
      'cookie-banner-visible-on-page-with-preference-form': false,
      'cookie-banner-reject-callback': this.acceptCookie,
      'cookie-banner-accept-callback': this.rejectCookie,
      'cookie-banner-auto-hide': false,
      'cookie-manifest': [
        // TODO add additional GA cookies
        {
          'category-name': 'essential',
          optional: false,
          cookies: ['nfdiv-cookie-preferences'],
        },
        {
          'category-name': 'analytics',
          optional: true,
          cookies: ['_ga', '_gid'],
        },
        {
          'category-name': 'apm',
          optional: true,
          cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
        },
      ],
        });
    this.setState();
  }

  public acceptCookie(): void {
    const expiryDays = '365';
    this.cookieService.setCookie('cookies_preferences_set', 'true', this.getExpiryDate());
    this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":true,"apm":true}', expiryDays);
    this.manageAPMCookie('true');
    const element = document. getElementById('accept-all-cookies-success');
    element.classList.remove('govuk-visually-hidden');

    const element1 = document. getElementById('cm_cookie_notification');
    element1.classList.add('govuk-visually-hidden');
    // document.getElementById('accept-all-cookies-success').classList.remove('govuk-visually-hidden');
    // document.getElementById('cm_cookie_notification').classList.add('govuk-visually-hidden');
    this.setState(true);
  }

  public manageAPMCookie(cookieStatus) {
    if (cookieStatus === 'false') {
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('dtCookie');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('dtLatC');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('dtPC');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('dtSa');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('rxVisitor');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('rxvt');
    }
    // eslint-disable-next-line no-use-before-define
    this.apmPreferencesUpdated(cookieStatus);
  }

  public apmPreferencesUpdated(cookieStatus) {
    const dtrum = window['dtrum'];
    // eslint-disable-next-line no-undefined
    if (dtrum !== undefined) {
      if (cookieStatus === 'true') {
        dtrum.enable();
        dtrum.enableSessionReplay();
      } else {
        dtrum.disableSessionReplay();
        dtrum.disable();
      }
    }
  }

  public rejectCookie(): void {
    const expiryDays = '365';
    this.cookieService.setCookie('cookies_preferences_set', 'true', expiryDays);
    this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":false,"apm":false}', expiryDays);
    this.manageAnalyticsCookies('false');
    this.manageAPMCookie('false');
    this.setState(true);
  }

  public manageAnalyticsCookies(cookieStatus) {
    if (cookieStatus === 'false') {
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('_ga');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('_gid');
      // eslint-disable-next-line no-use-before-define
      this.cookieService.deleteCookie('_gat');
    }
  }

  public setState(reload: boolean = false): void {
    this.isCookieBannerVisible = !this.cookieService.checkCookie(this.identifier);

    if (this.areCookiesAccepted()) {
      this.notifyAcceptance();
    } else {
      this.notifyRejection();
    }

    if (reload) { // reload if any of the buttons are pressed
      this.window.location.reload();
    }
  }

  public areCookiesAccepted(): boolean {
    return this.cookieService.checkCookie(this.identifier) && this.cookieService.getCookie(this.identifier) === 'true';
  }

  public notifyRejection(): void {
    this.rejectionNotifier.emit();
  }

  public notifyAcceptance(): void {
    this.acceptanceNotifier.emit();
  }

  private getExpiryDate(): string {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 31536000000;  //  in 365 days = 3600 * 1000 * 24 * 365
    now.setTime(expireTime);
    return now.toUTCString();
  }

}
