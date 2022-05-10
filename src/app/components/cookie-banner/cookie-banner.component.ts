import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../window';
import cookieManager from '@hmcts/cookie-manager';

@Component({
    selector: 'app-cookie-banner',
    templateUrl: './cookie-banner.component.html',
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;

  public isCookieBannerVisible = false;
  private readonly window: Window;

  constructor(
    private readonly cookieService: CookieService,
   @Inject(windowToken) window: any,
  ) {
    this.window = window as Window;
  }

  public ngOnInit(): void {

    const config = {
      userPreferences: {
        cookieName: 'ccpay-bubble-cookie-preferences',
      },
      cookieManifest: [
        {
          categoryName: 'analytics',
          cookies: [ '_ga', '_gid', '_gat_UA-' ]
        },
        {
          categoryName: 'apm',
          cookies: ['dtCookie','dtLatC','dtPC','dtSa','rxVisitor','rxvt']
        }
      ],
      cookieBanner: {
        class: 'cookie-banner',
        actions: [
          {
              name: 'accept',
              buttonClass: 'cookie-banner-accept-button',
              confirmationClass: 'cookie-banner-accept-message',
              consent: true
          },
          {
              name: 'reject',
              buttonClass: 'cookie-banner-reject-button',
              confirmationClass: 'cookie-banner-reject-message',
              consent: false
          },
          {
              name: 'hide',
              buttonClass: 'cookie-banner-hide-button'
          }
        ]
      },
      preferencesForm: {
        class: 'cookie-preferences-form'
      }
    };

    cookieManager.init(config);
    cookieManager.on('UserPreferencesLoaded', (preferences) => {
      (this.window as any).dataLayer = (this.window as any).dataLayer || [];
      (this.window as any).dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});

    });

    cookieManager.on('UserPreferencesSaved', (preferences) => {
      (this.window as any).dataLayer = (this.window as any).dataLayer || [];
      const dtrum = window['dtrum'];
    
      (this.window as any).dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
    
      if(dtrum !== undefined) {
        if(preferences.apm === 'on') {
          dtrum.enable();
          dtrum.enableSessionReplay();
        } else {
          dtrum.disableSessionReplay();
          dtrum.disable();
        }
      }
    });

  }

  // public acceptCookie(): void {
  //   const expiryDays = '365';
  //   this.cookieService.setCookie('cookies_preferences_set', 'true', this.getExpiryDate());
  //   this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":true,"apm":true}', expiryDays);
  //   this.manageAPMCookie('true');
  //   const element = document. getElementById('accept-all-cookies-success');
  //   element.classList.remove('govuk-visually-hidden');

  //   const element1 = document. getElementById('cm_cookie_notification');
  //   element1.classList.add('govuk-visually-hidden');
  //   // document.getElementById('accept-all-cookies-success').classList.remove('govuk-visually-hidden');
  //   // document.getElementById('cm_cookie_notification').classList.add('govuk-visually-hidden');
  //   this.setState(false);
  // }

  // public manageAPMCookie(cookieStatus) {
  //   if (cookieStatus === 'false') {
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('dtCookie');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('dtLatC');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('dtPC');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('dtSa');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('rxVisitor');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('rxvt');
  //   }
  //   // eslint-disable-next-line no-use-before-define
  //   this.apmPreferencesUpdated(cookieStatus);
  // }

  // public apmPreferencesUpdated(cookieStatus) {
  //   const dataLayer = window.dataLayer || [];
  //   const dtrum = window['dtrum'];
  //   // eslint-disable-next-line no-undefined
  //   if (dtrum !== undefined) {
  //     if (cookieStatus === 'true') {
  //       dtrum.enable();
  //       dtrum.enableSessionReplay();
  //     } else {
  //       dtrum.disableSessionReplay();
  //       dtrum.disable();
  //     }
  //   }
  // }

  // public rejectCookie(): void {
  //   const expiryDays = '365';
  //   this.cookieService.setCookie('cookies_preferences_set', 'true', expiryDays);
  //   this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":false,"apm":false}', expiryDays);
  //   this.manageAnalyticsCookies('false');
  //   this.manageAPMCookie('false');
  //   this.isCookieBannerVisible = false;
  //   this.setState(false);
  // }

  // public manageAnalyticsCookies(cookieStatus) {
  //   if (cookieStatus === 'false') {
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('_ga');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('_gid');
  //     // eslint-disable-next-line no-use-before-define
  //     this.cookieService.deleteCookie('_gat');
  //   }
  // }

  // public setState(reload: boolean = false): void {
  //   this.isCookieBannerVisible = !this.cookieService.checkCookie(this.identifier);

  //   if (this.areCookiesAccepted()) {
  //     this.notifyAcceptance();
  //   } else {
  //     this.notifyRejection();
  //   }

  //   if (reload) { // reload if any of the buttons are pressed
  //     this.window.location.reload();
  //   }
  // }

  // public areCookiesAccepted(): boolean {
  //   return this.cookieService.checkCookie(this.identifier) && this.cookieService.getCookie(this.identifier) === 'true';
  // }

  // public notifyRejection(): void {
  //   this.rejectionNotifier.emit();
  // }

  // public notifyAcceptance(): void {
  //   this.acceptanceNotifier.emit();
  // }

  // private getExpiryDate(): string {
  //   const now = new Date();
  //   const time = now.getTime();
  //   const expireTime = time + 31536000000;  //  in 365 days = 3600 * 1000 * 24 * 365
  //   now.setTime(expireTime);
  //   return now.toUTCString();
  // }

}
