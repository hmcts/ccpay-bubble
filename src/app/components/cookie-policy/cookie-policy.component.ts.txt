import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from '../../services/cookie/cookie.service';
import { CookiePolicyComponent } from './cookie-policy.component';

describe('CookiePolicyComponentTest', () => {
  @Component({
    selector: `app-host-dummy-component`,
    template: `<app-cookie-policy/>`
  })
  class TestDummyHostComponent {
    public cookiePolicy: CookiePolicyComponent;
  }
  const testHostComponent = TestDummyHostComponent;
  let component: CookiePolicyComponent;
// tslint:disable-next-line:prefer-const
  let cookieService: CookieService;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(async(() => {
    cookieService = jasmine.createSpyObj('CookieService', ['setCookie', 'checkCookie', 'getCookie', 'deleteCookie']);
    TestBed.configureTestingModule({
      declarations: [ CookiePolicyComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: CookieService, useValue: cookieService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });
  it('should include 4 security cookies', () => {
    expect(component.countCookies(component.SECURITY)).toBe(4);
  });
  it ('should return the __userid__ cookie as an identity cookie', () => {
    const cookieName = component.cookiesByCat(component.IDENTIFY)[0].name;
    expect (cookieName).toBe('__userid__');
  });
  it ('cookiesByCat should be consistent with countCookies', () => {
    const cookies = component.cookiesByCat(component.SECURITY);
    let cc = 0;
    for (const ccc of cookies) {
      expect(ccc.cat).toBe(component.SECURITY);
      cc = cc + 1;
    }
    expect (cc).toEqual(component.countCookies(component.SECURITY));
  });
  describe('setCookiePreference()', () => {
    it('should make a setCookie call', () => {
        spyOn(component, 'manageAnalyticsCookies').and.returnValue();
        spyOn(component, 'manageAPMCookie').and.returnValue();
        component.setCookiePreference();
        expect(cookieService.setCookie).toHaveBeenCalled();
    });
});
describe('manageAnalyticsCookies()', () => {
    it('should make a deleteCookie call', () => {
        const cookieStatus = 'false';
        component.manageAnalyticsCookies(cookieStatus);
        expect(cookieService.deleteCookie).toHaveBeenCalled();
    });
    it('should not make a deleteCookie call', () => {
        const cookieStatus = 'true';
        component.manageAnalyticsCookies(cookieStatus);
        expect(cookieService.deleteCookie).not.toHaveBeenCalled();
    });
});

describe('manageAPMCookie()', () => {
    it('should make a deleteCookie call', () => {
        const cookieStatus = 'false';
        spyOn(component, 'apmPreferencesUpdated').and.returnValue();
        component.manageAPMCookie(cookieStatus);
        expect(cookieService.deleteCookie).toHaveBeenCalled();
    });
    it('should not make a deleteCookie call', () => {
        const cookieStatus = 'true';
        spyOn(component, 'apmPreferencesUpdated').and.returnValue();
        component.manageAPMCookie(cookieStatus);
        expect(cookieService.deleteCookie).not.toHaveBeenCalled();
    });
});
});
