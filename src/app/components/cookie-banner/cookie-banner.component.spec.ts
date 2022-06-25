import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../../window';
import { CookieBannerComponent } from './cookie-banner.component';

const windowMock: Window = {
  location: { reload: () => {}},
  dataLayer : [],
  dtrum: { enable: () => {}, disable: () => {}, enableSessionReplay: () => {}, disableSessionReplay: () => {} }
} as any;

describe('CookieBannerComponent', () => {
  let appComponent: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookieService: any;
  let windowTestBed: Window;

  beforeEach(async(() => {
    const ksf = ['setCookie',
    'checkCookie',
    'getCookie',
    'deleteCookie',
    'manageAPMCookie',
    'apmPreferencesUpdated'];
    cookieService = jasmine.createSpyObj('CookieService', ksf);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CookieBannerComponent ],
      providers: [
        { provide: CookieService, useValue: cookieService },
        { provide: windowToken, useValue: windowMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieBannerComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
    windowTestBed = TestBed.get(windowToken);
  });

  describe('acceptCookie()', () => {
      it('should make a setCookie call', () => {
          cookieService.manageAPMCookie.and.returnValue(true);
          appComponent.acceptCookie();
          expect(cookieService.setCookie).toHaveBeenCalled();
      });
  });

  describe('rejectCookie()', () => {
      it('should make a setCookie call', () => {
          appComponent.rejectCookie();
          expect(cookieService.setCookie).toHaveBeenCalled();
      });
  });

  describe('manageAnalyticsCookies()', () => {
    it('should make a deleteCookie call', () => {
        const cookieStatus = 'false';
        appComponent.manageAnalyticsCookies(cookieStatus);
        expect(cookieService.deleteCookie).toHaveBeenCalled();
    });
    it('should not make a deleteCookie call', () => {
        const cookieStatus = 'true';
        appComponent.manageAnalyticsCookies(cookieStatus);
        expect(cookieService.deleteCookie).not.toHaveBeenCalled();
    });
  });
  describe('setState()', () => {
      it('should make a checkCookie call', () => {
          appComponent.setState();
          expect(cookieService.checkCookie).toHaveBeenCalled();
      });

      it('should set isCookieBannerVisible true when there is no cookie ', () => {
          cookieService.checkCookie.and.returnValue(false);
          appComponent.setState();
          expect(appComponent.isCookieBannerVisible).toBeTruthy();
      });

      it('should set isCookieBannerVisible false when there is a cookie', () => {
          cookieService.checkCookie.and.returnValue(true);
          appComponent.setState();
          expect(appComponent.isCookieBannerVisible).toBeFalsy();
      });

      it('should notify rejection when cookie is set to false', () => {
          const notifyRejectionSpy = spyOn(appComponent, 'notifyRejection');
          cookieService.checkCookie.and.returnValue(true);
          cookieService.getCookie.and.returnValue('false');
          appComponent.setState();
          expect(notifyRejectionSpy).toHaveBeenCalled();
      });

      it('should notify acceptance when cookie is set to true', () => {
          const notifyAcceptanceSpy = spyOn(appComponent, 'notifyAcceptance');
          cookieService.checkCookie.and.returnValue(true);
          cookieService.getCookie.and.returnValue('true');
          appComponent.setState();
          expect(notifyAcceptanceSpy).toHaveBeenCalled();
      });

      it('should get expiry date when we call getExpiryDate', () => {
        // @ts-ignore:
        appComponent.getExpiryDate();
        // @ts-ignore:
        expect(appComponent.getExpiryDate).not.toBeNull();
    });
  });

});
