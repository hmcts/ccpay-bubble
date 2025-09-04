import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { CookiePolicyComponent } from './cookie-policy.component';
import { Location } from '@angular/common';

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
  let fixture: ComponentFixture<CookiePolicyComponent>;
  let location: SpyLocation;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
    declarations: [CookiePolicyComponent],
    imports: [
        RouterTestingModule
    ],
    providers: [
        { provide: Location, useClass: SpyLocation },
        { provide: SpyLocation, useExisting: Location }
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(SpyLocation);
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
  it ('should return the __user-info cookie as an identity cookie', () => {
    const cookieName = component.cookiesByCat(component.IDENTIFY)[0].name;
    expect (cookieName).toBe('__user-info');
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

  it('should go back to previous page on header button click', () => {
    spyOn(location, 'back');
    component.backClicked();
    expect(location.back).toHaveBeenCalled();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
