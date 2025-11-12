import { Injectable } from '@angular/core';
import cookieManager from '@hmcts/cookie-manager';
import { BehaviorSubject } from 'rxjs';

interface CookiePreferences {
  [key: string]: string; // values 'on' | 'off'
}

@Injectable({ providedIn: 'root' })
export class CookiePreferencesService {
  private preferences$ = new BehaviorSubject<CookiePreferences | null>(null);
  readonly preferencesChanges$ = this.preferences$.asObservable();

  private readonly GTM_ID = 'GTM-KPGLNSPT';

  constructor() {
    this.initCookieManager();
    this.bindEvents();
  }

  private initCookieManager() {
    const config = {
      userPreferences: {
        cookieName: 'ccpay-bubble-cookie-preferences'
      },
      preferencesForm: { class: 'cookie-preferences-form' },
      cookieBanner: {
        class: 'cookie-banner',
        actions: [
          { name: 'accept', buttonClass: 'cookie-banner-accept-button', confirmationClass: 'cookie-banner-accept-message', consent: true },
          { name: 'reject', buttonClass: 'cookie-banner-reject-button', confirmationClass: 'cookie-banner-reject-message', consent: false },
          { name: 'hide', buttonClass: 'cookie-banner-hide-button' }
        ]
      },
      cookieManifest: [
        { categoryName: 'analytics', cookies: ['_ga', '_gid', '_gat_UA-'] },
        { categoryName: 'apm', cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'] },
        { categoryName: 'essential', optional: false, matchBy: 'exact', cookies: ['_csrf', '__user-info', '__site-id'] }
      ]
    } as any;
    cookieManager.init(config);
  }

  private bindEvents() {
    cookieManager.on('UserPreferencesLoaded', (prefs: CookiePreferences) => {
      this.preferences$.next(prefs);
      this.handleAnalyticsConsent(prefs);
      this.pushPreferencesEvent(prefs);
    });
    cookieManager.on('UserPreferencesSaved', (prefs: CookiePreferences) => {
      this.preferences$.next(prefs);
      this.handleAnalyticsConsent(prefs);
      this.handleApmConsent(prefs);
      this.pushPreferencesEvent(prefs);
    });
    cookieManager.on('PreferenceFormSubmitted', () => {
      const message = document.querySelector('.cookie-preference-success') as HTMLElement;
      if (message) {
        message.style.display = 'block';
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    });
  }

  private ensureDataLayer() { (window as any).dataLayer = (window as any).dataLayer || []; }

  private pushPreferencesEvent(prefs: CookiePreferences) {
    this.ensureDataLayer();
    (window as any).dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: prefs });
  }

  private handleAnalyticsConsent(prefs: CookiePreferences) {
    if (prefs.analytics === 'on') {
      this.injectGtm();
    } else {
      this.removeGtm();
    }
  }

  private handleApmConsent(prefs: CookiePreferences) {
    const dtrum = (window as any).dtrum;
    if (!dtrum) return;
    if (prefs.apm === 'on') {
      dtrum.enable && dtrum.enable();
      dtrum.enableSessionReplay && dtrum.enableSessionReplay();
    } else {
      dtrum.disableSessionReplay && dtrum.disableSessionReplay();
      dtrum.disable && dtrum.disable();
    }
  }

  private injectGtm() {
    if (document.getElementById('gtm-script')) return;
    this.ensureDataLayer();
    (function(w: any, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.id = 'gtm-script';
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', this.GTM_ID);
    const placeholder = document.getElementById('gtm-noscript-placeholder');
    if (placeholder && placeholder.innerHTML.trim() === '') {
      placeholder.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      placeholder.hidden = false;
    }
  }

  private removeGtm() {
    const gtmScript = document.getElementById('gtm-script');
    if (gtmScript?.parentNode) gtmScript.parentNode.removeChild(gtmScript);
    const placeholder = document.getElementById('gtm-noscript-placeholder');
    if (placeholder) {
      placeholder.hidden = true;
      placeholder.innerHTML = '';
    }
  }
}
