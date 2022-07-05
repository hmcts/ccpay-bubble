import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-details.component.html',
  styleUrls: ['./cookie-details.component.scss']

})

export class CookieDetailsComponent {
    // Ideally this would be an enum but angular can't seem to cope with enums in templates
    public readonly MORESERVICE = 'Moreservice';
    public readonly FAMILY = 'Family';
    public readonly SECURE = 'Secure';
    public readonly SECURE1 = 'Secure1';
    public readonly AUTHTOKEN = 'Authtoken';
    public readonly MONEYCLAIM = 'Moneyclaim';
    public readonly GOOGLE = 'Google';
    public readonly DYNATRACE = 'Dynatrace';

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
        {name: '_ga',
        cat: this.GOOGLE,
        purpose: 'This helps us count how many people visit the service by tracking if you’ve visited before',
        expires: '2 years'},
        {name: '_gat', cat: this.GOOGLE, purpose: 'Manages the rate at which page view requests are made', expires: '10 minutes'},
        {name: '_gid', cat: this.GOOGLE, purpose: 'Identifies you to the service', expires: '24 hours'},
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
