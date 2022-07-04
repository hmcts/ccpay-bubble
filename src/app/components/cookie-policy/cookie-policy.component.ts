import { Component, OnInit} from '@angular/core';
import cookieManager from '@hmcts/cookie-manager';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']

})

export class CookiePolicyComponent implements OnInit {
    // Ideally this would be an enum but angular can't seem to cope with enums in templates
    public readonly USAGE = 'Usage';
    public readonly INTRO = 'Intro';
    public readonly SESSION = 'Session';
    public readonly IDENTIFY = 'Identify';
    public readonly SECURITY = 'Security';
    public readonly GOOGLE = 'Google';
    public readonly DYNATRACE = 'Dynatrace';

    public readonly MORESERVICE = 'Moreservice';
    public readonly FAMILY = 'Family';
    public readonly SECURE = 'Secure';
    public readonly SECURE1 = 'Secure1';
    public readonly AUTHTOKEN = 'Authtoken';
    public readonly MONEYCLAIM = 'Moneyclaim';

    public readonly PARACONTENT = `Session cookies are stored on your computer as you travel through a website,
    and let the website know what you’ve seen and done so far.\n
    These are temporary cookies and are automatically deleted a short while after you leave the website.`;
    public readonly SECHEADING = `Cookies used to store the answers you’ve given during your visit (known as a ‘session’)`;
    isCookiePageEnabled = false;
    labelArray = [
      'Cookie name',
      'What this cookie is for',
      'Expires after'
    ];

    public cookieDetails =
      [
        {name: 'ccpay-bubble', cat: this.SECURITY, purpose: 'Used to secure communications with HMCTS data services', expires: '8 hours'},
        {name: 'rxVisitor', cat: this.USAGE, purpose: 'Generated user ID for usage tracking (Dynatrace)', expires: '2 years'},
        {name: 'ai_user', cat: this.USAGE, purpose: 'Generated user ID for usage tracking (Application Insights)', expires: '6 months'},
        {name: '_oauth2_proxy', cat: this.SECURITY, purpose: 'Used to protect your login session', expires: '4 hours'},
        {name: '_ga',
        cat: this.GOOGLE,
        purpose: 'This helps us count how many people visit the service by tracking if you’ve visited before',
        expires: '2 years'},
        {name: '_gat', cat: this.GOOGLE, purpose: 'Manages the rate at which page view requests are made', expires: '10 minutes'},
        {name: '_gid', cat: this.GOOGLE, purpose: 'Identifies you to the service', expires: '24 hours'},
        {name: '__userid__', cat: this.IDENTIFY, purpose: 'Your user ID', expires: 'When you close your browser'},
        {name: '__auth__',
        cat: this.SECURITY,
        purpose: 'Information about your current system authorisations', expires: 'When you close your browser'},
        {name: 'XSRF-TOKEN',
        cat: this.SECURITY,
        purpose: 'Used to protect your session against cross site scripting attacks', expires: 'When you close your browser'},
        {name: 'dtCookie', cat: this.DYNATRACE, purpose: 'Tracks a visit across multiple request', expires: 'When session ends'},
        {name: 'dtLatC', cat: this.DYNATRACE, purpose: 'Measures server latency for performance monitoring', expires: 'When session ends'},
        {name: 'dtPC',
        cat: this.DYNATRACE,
        purpose: 'dtPC	Required to identify proper endpoints for beacon transmission; includes session ID for correlation',
        expires: 'When session ends'},
        {name: 'dtSa', cat: this.DYNATRACE, purpose: 'Intermediate store for page-spanning actions', expires: 'When session ends'},
        {name: 'rxVisitor', cat: this.DYNATRACE, purpose: 'Visitor ID to correlate sessions', expires: '1 year'},
        {name: 'rxvt', cat: this.DYNATRACE, purpose: 'Session timeout', expires: 'When session ends'},

        {name: 'TSxxxxxxxx', cat: this.MORESERVICE,
        purpose: 'Protects your session from tampering', expires: 'When you close your browser'},
        {name: '__state', cat: this.MORESERVICE,
        purpose: 'Identifies you to the service and secures your authentication', expires: 'When you close your browser'},
        {name: 'X_CMC', cat: this.MORESERVICE,
        purpose: 'Helps us keep track of your session', expires: 'When you close your browser'},

        {name: 'connect.sid', cat: this.FAMILY, purpose: 'Carries details of your current session', expires: 'When you close your browser'},
        {name: 'sessionKey', cat: this.FAMILY, purpose: 'rotects your session using encryption', expires: 'When you close your browser'},

        {name: 'state', cat: this.SECURE,
        purpose: 'Identifies you to the service and secures your authentication', expires: 'When session ends'},
        {name: 'ARRAfinnity', cat: this.SECURE, purpose: 'Protects your session from tampering', expires: 'When session ends'},
        {name: '_csrf', cat: this.SECURE, purpose: 'Helps protect against forgery', expires: 'When session ends'},

        {name: '__auth-token', cat: this.AUTHTOKEN, purpose: 'Identifies you to the service', expires: 'When you close your browser'},


        {name: 'TS01842b02', cat: this.SECURE1,
        purpose: 'Protects your session from tampering', expires: 'When you close your browser'},
        {name: '__state', cat: this.SECURE1,
        purpose: 'Identifies you to the service and secures your authentication', expires: 'When you close your browser'},
        {name: '_csrf', cat: this.SECURE1, purpose: 'Helps protect against forgery', expires: 'When you close your browser'},

        {name: 'session_ID', cat: this.MONEYCLAIM, purpose: 'Keeps track of your answers', expires: 'When session ends'},
        {name: 'eligibility-check', cat: this.MONEYCLAIM, purpose: 'Stores answers to eligibility questions', expires: 'Ten minutes'}


      ];


  ngOnInit(): void {
    cookieManager.on('PreferenceFormSubmitted', () => {
      const message = document.querySelector('.cookie-preference-success') as HTMLElement;
      message.style.display = 'block';
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }

  public countCookies(category: string): number {
    return this.cookiesByCat(category).length;
  }

  public cookiesByCat(category: string): {name: string, cat: string, purpose: string, expires: string}[] {
    return this.cookieDetails.filter(c => c.cat === category);
  }
  showCookiePage() {
   this.isCookiePageEnabled = true;
  }
  hideCookiePage() {
    this.isCookiePageEnabled = false;
  }
}
