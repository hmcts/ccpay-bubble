import { Component, Inject, Input, OnInit } from '@angular/core';
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

  private readonly window: Window;

  constructor(
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
          },
          {
            categoryName: 'essential',
            optional: false,
            matchBy: 'exact',
            cookies: [
              '_csrf',
              '__user-info'
            ]
          },
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
  }
}
