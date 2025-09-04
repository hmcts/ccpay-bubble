import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieDetailsComponent } from './cookie-details.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CookieDetailsComponentTest', () => {
  @Component({
    selector: `app-host-dummy-component`,
    template: `<app-cookie-details/>`
  })
  class TestDummyHostComponent {
    public cookiePolicy: CookieDetailsComponent;
  }
  const testHostComponent = TestDummyHostComponent;
  let component: CookieDetailsComponent;
  let fixture: ComponentFixture<CookieDetailsComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
    declarations: [CookieDetailsComponent],
    imports: [
        RouterTestingModule
    ],
    schemas: [NO_ERRORS_SCHEMA]
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
    expect(component.countCookies(component.MORESERVICE)).toBe(3);
  });
  it ('should return the TSxxxxxxxx cookie as an identity cookie', () => {
    const cookieName = component.cookiesByCat(component.MORESERVICE)[0].name;
    expect (cookieName).toBe('TSxxxxxxxx');
  });
  it ('cookiesByCat should be consistent with countCookies', () => {
    const cookies = component.cookiesByCat(component.MORESERVICE);
    let cc = 0;
    for (const ccc of cookies) {
      expect(ccc.cat).toBe(component.MORESERVICE);
      cc = cc + 1;
    }
    expect (cc).toEqual(component.countCookies(component.MORESERVICE));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
