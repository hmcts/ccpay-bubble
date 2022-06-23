import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../../window';
import cookieManager from '@hmcts/cookie-manager';

@Component({
    selector: 'app-cookie-banner',
    templateUrl: './cookie-banner.component.html',
    styleUrls: ['./cookie-banner.component.scss']
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;
  @Output() public rejectionNotifier = new EventEmitter<any>();
  @Output() public acceptanceNotifier = new EventEmitter<any>();

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
        preferencesForm: {
            class: 'cookie-preferences-form',
        },
        cookieManifest: [
          {
            categoryName: 'analytics',
            cookies: [
              '_ga',
              '_gid',
              '_gat_UA-'
            ]
          },
          {
            categoryName: 'apm',
            cookies: [
              'dtCookie',
              'dtLatC',
              'dtPC',
              'dtSa',
              'rxVisitor',
              'rxvt'
            ]
          }
        ]
      };

      cookieManager.on('UserPreferencesLoaded', (preferences) => {
        const dataLayer = window['dataLayer'] || [];
        dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
      });
      cookieManager.on('UserPreferencesSaved', (preferences) => {
        const dataLayer = window['dataLayer'] || [];
        const dtrum = window['dtrum'];
        dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
        if (dtrum !== undefined) {
          if (preferences.apm === 'on') {
            dtrum.enable();
            dtrum.enableSessionReplay();
          } else {
            dtrum.disableSessionReplay();
            dtrum.disable();
          }
        }
      });
    cookieManager.init(config);
    this.setState();
  }

  public acceptCookie(): void {
    const expiryDays = '365';
    this.cookieService.setCookie('cookies_preferences_set', 'true', this.getExpiryDate());
    this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":true,"apm":true}', expiryDays);
    this.manageAPMCookie('true');
    this.setState(false);
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
    this.isCookieBannerVisible = false;
    this.setState(false);
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
