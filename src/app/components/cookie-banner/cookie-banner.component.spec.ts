import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  let windowTestBed: Window;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CookieBannerComponent ],
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
    windowTestBed = TestBed.get(windowToken);
  });
  it('should create', () => {
    expect(appComponent).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });
  it ('should make a call all enable function', () => {
    spyOn((windowTestBed as any).dtrum, 'enable').and.callThrough();
    spyOn((windowTestBed as any).dtrum, 'enableSessionReplay').and.callThrough();
    const preference = { apm: 'on' };

    appComponent.preferenceFn((windowTestBed as any).dtrum, preference)
   expect((windowTestBed as any).dtrum.enable).toHaveBeenCalled();
   expect((windowTestBed as any).dtrum.enableSessionReplay).toHaveBeenCalled();

  });
  it ('should make a call all disable function', () => {
    spyOn((windowTestBed as any).dtrum, 'disableSessionReplay').and.callThrough();
    spyOn((windowTestBed as any).dtrum, 'disable').and.callThrough();
    const preference = { apm: 'off' };

    appComponent.preferenceFn((windowTestBed as any).dtrum, preference)
   expect((windowTestBed as any).dtrum.disableSessionReplay).toHaveBeenCalled();
   expect((windowTestBed as any).dtrum.disable).toHaveBeenCalled();

  });
});
