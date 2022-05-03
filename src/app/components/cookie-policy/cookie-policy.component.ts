import { Component} from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html'
})

export class CookiePolicyComponent {

  constructor(
    private readonly cookieService: CookieService
  ){}

  public readonly googlePurpose = 'This helps us count how many people visit the service by tracking if you\'ve visited before';
// Ideally this would be an enum but angular can't seem to cope with enums in templates
  public readonly USAGE = 'Usage';
  public readonly INTRO = 'Intro';
  public readonly SESSION = 'Session';
  public readonly IDENTIFY = 'Identify';
  public readonly SECURITY = 'Security';
  public readonly GOOGLE = 'Google';
  public readonly DYNATRACE = 'Dynatrace';


  public cookieDetails =
    [
      {name: 'ccpay-bubble', cat: this.SECURITY, purpose: 'Used to secure communications with HMCTS data services', expires: '8 hours'},
      {name: 'rxVisitor', cat: this.USAGE, purpose: 'Generated user ID for usage tracking (Dynatrace)', expires: '2 years'},
      {name: 'ai_user', cat: this.USAGE, purpose: 'Generated user ID for usage tracking (Application Insights)', expires: '6 months'},
      {name: '_oauth2_proxy', cat: this.SECURITY, purpose: 'Used to protect your login session', expires: '4 hours'},
      {name: '_gid', cat: this.GOOGLE, purpose: this.googlePurpose, expires: '1 day'},
      {name: '_ga', cat: this.GOOGLE, purpose: 'This stores information about your session', expires: '2 years'},
      {name: '_ga_XXXXXXXXXX', cat: this.GOOGLE, purpose: 'This stores information about your session', expires: '2 years'},
      {name: '_gat_XXXXXXXXXX', cat: this.GOOGLE, purpose: 'This is used to control the rate at which requests to the analytics software are made', expires: '1 day'},
      {name: '__userid__', cat: this.IDENTIFY, purpose: 'Your user ID', expires: 'When you close your browser'},
      {name: '__auth__', cat: this.SECURITY, purpose: 'Information about your current system authorisations', expires: 'When you close your browser'},
      {name: 'XSRF-TOKEN', cat: this.SECURITY, purpose: 'Used to protect your session against cross site scripting attacks', expires: 'When you close your browser'},
      {name: 'dtCookie', cat: this.DYNATRACE, purpose: 'Tracks a visit across multiple request', expires: 'When session ends'},
      {name: 'dtLatC', cat: this.DYNATRACE, purpose: 'Measures server latency for performance monitoring', expires: 'When session ends'},
      {name: 'dtPC', cat: this.DYNATRACE, purpose: 'dtPC	Required to identify proper endpoints for beacon transmission; includes session ID for correlation', expires: 'When session ends'},
      {name: 'dtSa', cat: this.DYNATRACE, purpose: 'Intermediate store for page-spanning actions', expires: 'When session ends'},
      {name: 'rxVisitor', cat: this.DYNATRACE, purpose: 'Visitor ID to correlate sessions', expires: '1 year'},
      {name: 'rxvt', cat: this.DYNATRACE, purpose: 'Session timeout', expires: 'When session ends'}
   
    ];

  public countCookies(category: string): number {
    return this.cookiesByCat(category).length;
  }

  public cookiesByCat(category: string): {name: string, cat: string, purpose: string, expires: string}[] {
    return this.cookieDetails.filter(c => c.cat === category);
  }

   setCookiePreference() {
    let getAnalyticsSelectedValue = (<HTMLInputElement>document.querySelector('input[name="analytics"]:checked')).value;
    let getApmSelectedValue = (<HTMLInputElement>document.querySelector('input[name="apm"]:checked')).value;
    this.cookieService.setCookie('cookies_preferences_set', 'true', '365')
    this.cookieService.setCookie('cookies_policy', '{"essential":true,"analytics":' + getAnalyticsSelectedValue
                                + ',"apm:"' + getApmSelectedValue
                                + '}', '365')
    // document.getElementById("cookie-preference-success").classList.remove("govuk-visually-hidden");
    // if (document.getElementById('accept-all-cookies-successs')) {
    //   document.getElementById('accept-all-cookies-success').classList.add('govuk-visually-hidden');
    // }
    // if (document.getElementById('reject-all-cookies-success')) {
    //   document.getElementById('reject-all-cookies-success').classList.add('govuk-visually-hidden');
    // }
    // if (document.getElementById('cm_cookie_notification')) {
    //   document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
    // }

    this.manageAnalyticsCookies(getAnalyticsSelectedValue);
    this.manageAPMCookie(getApmSelectedValue);
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
}