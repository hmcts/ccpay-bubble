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
  const cookieService: CookieService;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(async(() => {
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
});
