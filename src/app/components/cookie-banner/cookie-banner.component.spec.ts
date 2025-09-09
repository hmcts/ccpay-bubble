import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { windowToken } from '../../../window';
import { CookieBannerComponent } from './cookie-banner.component';

const windowMock: Window = {
  location: { reload: () => {}},
  dataLayer : [],
  /* tslint:disable:no-empty */
  dtrum: { enable: () => {}, disable: () => {}, enableSessionReplay: () => {}, disableSessionReplay: () => {} }
} as any;

describe('CookieBannerComponent', () => {
  let appComponent: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let windowTestBed: Window;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ CookieBannerComponent ],
      providers: [
        { provide: windowToken, useValue: windowMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieBannerComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
    windowTestBed = TestBed.inject(windowToken) as any;
  });
  it('should create', () => {
    expect(appComponent).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
