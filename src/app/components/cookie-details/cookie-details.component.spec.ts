import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieDetailsComponent } from './cookie-details.component';

describe('CookieDetailsComponentTest', () => {
  @Component({
    selector: `app-host-dummy-component`,
    template: `<app-cookie-policy/>`
  })
  class TestDummyHostComponent {
    public cookiePolicy: CookieDetailsComponent;
  }
  const testHostComponent = TestDummyHostComponent;
  let component: CookieDetailsComponent;
  let fixture: ComponentFixture<CookieDetailsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ CookieDetailsComponent ],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieDetailsComponent);
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
