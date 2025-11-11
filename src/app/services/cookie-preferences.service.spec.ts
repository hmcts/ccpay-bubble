import { TestBed } from '@angular/core/testing';
import { CookiePreferencesService } from './cookie-preferences.service';

describe('CookiePreferencesService', () => {
  let service: CookiePreferencesService;
  let mockCookieManager: any;

  beforeEach(() => {
    // Mock window.cookieManager
    mockCookieManager = {
      init: jasmine.createSpy('init'),
      on: jasmine.createSpy('on')
    };
    (window as any).cookieManager = mockCookieManager;

    // Mock window.dataLayer
    (window as any).dataLayer = [];

    // Mock window.dtrum (APM)
    (window as any).dtrum = {
      enable: jasmine.createSpy('enable'),
      disable: jasmine.createSpy('disable'),
      enableSessionReplay: jasmine.createSpy('enableSessionReplay'),
      disableSessionReplay: jasmine.createSpy('disableSessionReplay')
    };

    TestBed.configureTestingModule({
      providers: [CookiePreferencesService]
    });

    service = TestBed.inject(CookiePreferencesService);
  });

  afterEach(() => {
    // Clean up GTM script if present
    const gtmScript = document.getElementById('gtm-script');
    if (gtmScript?.parentNode) {
      gtmScript.parentNode.removeChild(gtmScript);
    }
    // Clean up noscript placeholder
    const placeholder = document.getElementById('gtm-noscript-placeholder');
    if (placeholder) {
      placeholder.innerHTML = '';
      placeholder.hidden = true;
    }
    // Clean up dataLayer
    (window as any).dataLayer = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize cookie manager with correct config', () => {
    expect(mockCookieManager.init).toHaveBeenCalledWith(jasmine.objectContaining({
      userPreferences: jasmine.objectContaining({
        cookieName: 'ccpay-bubble-cookie-preferences'
      }),
      preferencesForm: jasmine.objectContaining({
        class: 'cookie-preferences-form'
      }),
      cookieManifest: jasmine.arrayContaining([
        jasmine.objectContaining({ categoryName: 'analytics' }),
        jasmine.objectContaining({ categoryName: 'apm' }),
        jasmine.objectContaining({ categoryName: 'essential', optional: false })
      ])
    }));
  });

  it('should bind to UserPreferencesLoaded event', () => {
    expect(mockCookieManager.on).toHaveBeenCalledWith('UserPreferencesLoaded', jasmine.any(Function));
  });

  it('should bind to UserPreferencesSaved event', () => {
    expect(mockCookieManager.on).toHaveBeenCalledWith('UserPreferencesSaved', jasmine.any(Function));
  });

  it('should bind to PreferenceFormSubmitted event', () => {
    expect(mockCookieManager.on).toHaveBeenCalledWith('PreferenceFormSubmitted', jasmine.any(Function));
  });

  describe('GTM injection based on analytics consent', () => {
    let userPreferencesLoadedCallback: (prefs: any) => void;

    beforeEach(() => {
      // Capture the UserPreferencesLoaded callback
      const calls = mockCookieManager.on.calls.all();
      const loadedCall = calls.find((call: any) => call.args[0] === 'UserPreferencesLoaded');
      userPreferencesLoadedCallback = loadedCall?.args[1];
    });

    it('should inject GTM script when analytics consent is "on"', () => {
      expect(userPreferencesLoadedCallback).toBeDefined();

      // Trigger consent event
      userPreferencesLoadedCallback({ analytics: 'on' });

      // Verify GTM script was injected
      const gtmScript = document.getElementById('gtm-script');
      expect(gtmScript).toBeTruthy();
      expect(gtmScript?.getAttribute('src')).toContain('googletagmanager.com/gtm.js?id=GTM-KPGLNSPT');
    });

    it('should not inject GTM script when analytics consent is "off"', () => {
      userPreferencesLoadedCallback({ analytics: 'off' });

      const gtmScript = document.getElementById('gtm-script');
      expect(gtmScript).toBeNull();
    });

    it('should remove GTM script when consent changes from "on" to "off"', () => {
      // First, consent on
      userPreferencesLoadedCallback({ analytics: 'on' });
      expect(document.getElementById('gtm-script')).toBeTruthy();

      // Then, consent off (simulate UserPreferencesSaved)
      const savedCall = mockCookieManager.on.calls.all()
        .find((call: any) => call.args[0] === 'UserPreferencesSaved');
      const savedCallback = savedCall?.args[1];

      savedCallback({ analytics: 'off' });
      expect(document.getElementById('gtm-script')).toBeNull();
    });

    it('should inject noscript iframe placeholder when analytics is "on"', () => {
      // Create placeholder element
      const placeholder = document.createElement('noscript');
      placeholder.id = 'gtm-noscript-placeholder';
      placeholder.hidden = true;
      document.body.appendChild(placeholder);

      userPreferencesLoadedCallback({ analytics: 'on' });

      expect(placeholder.hidden).toBe(false);
      expect(placeholder.innerHTML).toContain('googletagmanager.com/ns.html?id=GTM-KPGLNSPT');

      // Cleanup
      document.body.removeChild(placeholder);
    });

    it('should push Cookie Preferences event to dataLayer', () => {
      const prefs = { analytics: 'on', apm: 'off' };
      userPreferencesLoadedCallback(prefs);

      expect((window as any).dataLayer).toContain(
        jasmine.objectContaining({
          event: 'Cookie Preferences',
          cookiePreferences: prefs
        })
      );
    });
  });

  describe('APM consent handling', () => {
    let userPreferencesSavedCallback: (prefs: any) => void;

    beforeEach(() => {
      const calls = mockCookieManager.on.calls.all();
      const savedCall = calls.find((call: any) => call.args[0] === 'UserPreferencesSaved');
      userPreferencesSavedCallback = savedCall?.args[1];
    });

    it('should enable APM when apm consent is "on"', () => {
      const dtrum = (window as any).dtrum;

      userPreferencesSavedCallback({ apm: 'on', analytics: 'off' });

      expect(dtrum.enable).toHaveBeenCalled();
      expect(dtrum.enableSessionReplay).toHaveBeenCalled();
    });

    it('should disable APM when apm consent is "off"', () => {
      const dtrum = (window as any).dtrum;

      userPreferencesSavedCallback({ apm: 'off', analytics: 'off' });

      expect(dtrum.disable).toHaveBeenCalled();
      expect(dtrum.disableSessionReplay).toHaveBeenCalled();
    });

    it('should handle missing dtrum gracefully', () => {
      delete (window as any).dtrum;

      // Should not throw
      expect(() => {
        userPreferencesSavedCallback({ apm: 'on', analytics: 'off' });
      }).not.toThrow();
    });
  });

  describe('PreferenceFormSubmitted event', () => {
    let formSubmittedCallback: () => void;

    beforeEach(() => {
      const calls = mockCookieManager.on.calls.all();
      const submittedCall = calls.find((call: any) => call.args[0] === 'PreferenceFormSubmitted');
      formSubmittedCallback = submittedCall?.args[1];
    });

    it('should display success message and scroll to top', () => {
      const message = document.createElement('div');
      message.className = 'cookie-preference-success';
      message.style.display = 'none';
      document.body.appendChild(message);

      formSubmittedCallback();

      expect(message.style.display).toBe('block');

      // Cleanup
      document.body.removeChild(message);
    });
  });

  describe('preferencesChanges$ observable', () => {
    it('should emit preferences when UserPreferencesLoaded fires', (done) => {
      const prefs = { analytics: 'on', apm: 'on' };

      service.preferencesChanges$.subscribe(emittedPrefs => {
        if (emittedPrefs) {
          expect(emittedPrefs).toEqual(prefs);
          done();
        }
      });

      // Trigger the event
      const calls = mockCookieManager.on.calls.all();
      const loadedCall = calls.find((call: any) => call.args[0] === 'UserPreferencesLoaded');
      loadedCall?.args[1](prefs);
    });
  });
});
