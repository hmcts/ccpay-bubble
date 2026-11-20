import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mediaQuery: { matches: boolean; addEventListener: jasmine.Spy };
  let originalBreakpoint: string;
  let frontendSupported: boolean;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    originalBreakpoint = document.documentElement.style.getPropertyValue('--govuk-breakpoint-tablet');
    frontendSupported = document.body.classList.contains('govuk-frontend-supported');
    document.documentElement.style.setProperty('--govuk-breakpoint-tablet', '40.0625rem');
    document.body.classList.add('govuk-frontend-supported');
    mediaQuery = { matches: true, addEventListener: jasmine.createSpy('addEventListener') };
    spyOn(window, 'matchMedia').and.returnValue(mediaQuery as unknown as MediaQueryList);

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update Reports when the bulk scanning feature flag changes', () => {
    component.isBulkscanningEnable = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#reports-link')).toBeNull();

    component.isBulkscanningEnable = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#reports-link').getAttribute('href'))
      .toBe('/payment-history/view?view=reports');

    component.isBulkscanningEnable = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#reports-link')).toBeNull();
  });

  it('should expand and collapse the mobile menu', () => {
    mediaQuery.matches = false;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const menu: HTMLUListElement = fixture.nativeElement.querySelector('#service-navigation');

    expect(button.hidden).toBeFalse();
    expect(button.hasAttribute('aria-hidden')).toBeFalse();
    expect(button.getAttribute('aria-controls')).toBe(menu.id);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hidden).toBeTrue();

    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.hidden).toBeFalse();

    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.hidden).toBeTrue();
  });

  it('should show the navigation when resized from mobile to desktop', () => {
    mediaQuery.matches = false;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const menu: HTMLUListElement = fixture.nativeElement.querySelector('#service-navigation');

    mediaQuery.matches = true;
    mediaQuery.addEventListener.calls.mostRecent().args[1]();

    expect(menu.hidden).toBeFalse();
    expect(button.hidden).toBeTrue();
    expect(button.getAttribute('aria-hidden')).toBe('true');
  });

  afterEach(() => {
    fixture.destroy();
    if (originalBreakpoint) {
      document.documentElement.style.setProperty('--govuk-breakpoint-tablet', originalBreakpoint);
    } else {
      document.documentElement.style.removeProperty('--govuk-breakpoint-tablet');
    }
    if (!frontendSupported) {
      document.body.classList.remove('govuk-frontend-supported');
    }
    TestBed.resetTestingModule();
  });
});
