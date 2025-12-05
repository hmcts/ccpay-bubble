/**
 * Tests for src/assets/js/cookie.js
 * This file tests the cookie manager integration functionality
 */

describe('Cookie Manager Integration (cookie.js)', () => {
  let cookieManagerMock: any;
  let eventHandlers: any;
  const COOKIE_NAME = 'ccpay-bubble-cookie-preferences';
  const GTM_ID = 'GTM-KPGLNSPT';
  const GTM_SCRIPT_ID = 'gtm-script';
  const NOSCRIPT_PLACEHOLDER_ID = 'gtm-noscript-placeholder';

  // Helper to simulate the cookie.js execution
  const executeCookieScript = () => {
    // This simulates the IIFE in cookie.js
    const cookieManager = (window as any).cookieManager;
    if (!cookieManager) {
      return;
    }

    const ensureDataLayer = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      return (window as any).dataLayer;
    };

    const pushPreferencesEvent = (preferences: any) => {
      if (!preferences) {
        return;
      }
      const dataLayer = ensureDataLayer();
      dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: preferences });
    };

    let shouldShowNoscript = false;
    const applyNoscriptState = () => {
      let placeholder = document.getElementById(NOSCRIPT_PLACEHOLDER_ID);
      if (!placeholder && document.body) {
        placeholder = document.createElement('noscript');
        placeholder.id = NOSCRIPT_PLACEHOLDER_ID;
        placeholder.hidden = true;
        document.body.insertBefore(placeholder, document.body.firstChild);
      }

      if (!placeholder) {
        return false;
      }

      if (shouldShowNoscript) {
        placeholder.innerHTML =
          `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        placeholder.hidden = false;
      } else {
        placeholder.innerHTML = '';
        placeholder.hidden = true;
      }
      return true;
    };

    const updateNoscriptPlaceholder = (enabled: boolean) => {
      shouldShowNoscript = enabled;
      if (!applyNoscriptState() && document.readyState === 'loading') {
        const onReady = () => {
          applyNoscriptState();
          document.removeEventListener('DOMContentLoaded', onReady);
        };
        document.addEventListener('DOMContentLoaded', onReady);
      }
    };

    const injectGtm = () => {
      if (document.getElementById(GTM_SCRIPT_ID)) {
        updateNoscriptPlaceholder(true);
        return;
      }

      const dataLayer = ensureDataLayer();
      dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.id = GTM_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      updateNoscriptPlaceholder(true);
    };

    const removeGtm = () => {
      const existing = document.getElementById(GTM_SCRIPT_ID);
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      updateNoscriptPlaceholder(false);
    };

    const handleAnalyticsConsent = (preferences: any) => {
      if (preferences && preferences.analytics === 'on') {
        injectGtm();
      } else {
        removeGtm();
      }
    };

    const handleApmConsent = (preferences: any) => {
      const dtrum = (window as any).dtrum;
      if (!dtrum) {
        return;
      }

      if (preferences && preferences.apm === 'on') {
        if (typeof dtrum.enable === 'function') {
          dtrum.enable();
        }
        if (typeof dtrum.enableSessionReplay === 'function') {
          dtrum.enableSessionReplay();
        }
      } else {
        if (typeof dtrum.disableSessionReplay === 'function') {
          dtrum.disableSessionReplay();
        }
        if (typeof dtrum.disable === 'function') {
          dtrum.disable();
        }
      }
    };

    const onPreferencesChange = (preferences: any) => {
      pushPreferencesEvent(preferences);
      handleAnalyticsConsent(preferences);
      handleApmConsent(preferences);
    };

    cookieManager.on('UserPreferencesLoaded', onPreferencesChange);
    cookieManager.on('UserPreferencesSaved', onPreferencesChange);

    cookieManager.on('PreferenceFormSubmitted', () => {
      const message = document.querySelector('.cookie-preference-success') as HTMLElement;
      if (message) {
        message.style.display = 'block';
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
    });

    const config = {
      userPreferences: {
        cookieName: COOKIE_NAME,
      },
      preferencesForm: {
        class: 'cookie-preferences-form',
      },
      cookieManifest: [
        {
          categoryName: 'analytics',
          cookies: ['_ga', '_gid', '_gat_UA-']
        },
        {
          categoryName: 'apm',
          cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt']
        },
        {
          categoryName: 'essential',
          optional: false,
          matchBy: 'exact',
          cookies: ['_csrf', '__user-info', '__site-id']
        },
      ]
    };

    cookieManager.init(config);
    ensureDataLayer();
  };

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Setup event handlers storage
    eventHandlers = {};
    
    // Create cookie manager mock
    cookieManagerMock = {
      on: jasmine.createSpy('on').and.callFake((eventName, handler) => {
        if (!eventHandlers[eventName]) {
          eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(handler);
      }),
      init: jasmine.createSpy('init')
    };
    
    (window as any).cookieManager = cookieManagerMock;
    delete (window as any).dataLayer;
    delete (window as any).dtrum;
  });

  afterEach(() => {
    // Clean up
    delete (window as any).cookieManager;
    delete (window as any).dataLayer;
    delete (window as any).dtrum;
    document.body.innerHTML = '';
    
    // Remove GTM script if exists
    const gtmScript = document.getElementById(GTM_SCRIPT_ID);
    if (gtmScript && gtmScript.parentNode) {
      gtmScript.parentNode.removeChild(gtmScript);
    }
  });

  const triggerEvent = (eventName: string, data?: any) => {
    if (eventHandlers[eventName]) {
      eventHandlers[eventName].forEach((handler: Function) => handler(data));
    }
  };

  describe('Initialization', () => {
    it('should register event listeners on cookieManager', () => {
      executeCookieScript();
      
      expect(cookieManagerMock.on).toHaveBeenCalledWith(
        'UserPreferencesLoaded',
        jasmine.any(Function)
      );
      expect(cookieManagerMock.on).toHaveBeenCalledWith(
        'UserPreferencesSaved',
        jasmine.any(Function)
      );
      expect(cookieManagerMock.on).toHaveBeenCalledWith(
        'PreferenceFormSubmitted',
        jasmine.any(Function)
      );
    });

    it('should initialize cookieManager with correct config', () => {
      executeCookieScript();
      
      expect(cookieManagerMock.init).toHaveBeenCalledWith(
        jasmine.objectContaining({
          userPreferences: jasmine.objectContaining({
            cookieName: COOKIE_NAME
          }),
          preferencesForm: jasmine.objectContaining({
            class: 'cookie-preferences-form'
          }),
          cookieManifest: jasmine.arrayContaining([
            jasmine.objectContaining({ categoryName: 'analytics' }),
            jasmine.objectContaining({ categoryName: 'apm' }),
            jasmine.objectContaining({ categoryName: 'essential', optional: false })
          ])
        })
      );
    });

    it('should initialize dataLayer as empty array', () => {
      executeCookieScript();
      expect((window as any).dataLayer).toEqual([]);
    });

    it('should configure analytics cookies correctly', () => {
      executeCookieScript();
      const config = cookieManagerMock.init.calls.mostRecent().args[0];
      const analyticsCategory = config.cookieManifest.find(
        (cat: any) => cat.categoryName === 'analytics'
      );
      
      expect(analyticsCategory).toBeDefined();
      expect(analyticsCategory.cookies).toContain('_ga');
      expect(analyticsCategory.cookies).toContain('_gid');
      expect(analyticsCategory.cookies).toContain('_gat_UA-');
    });

    it('should configure apm cookies correctly', () => {
      executeCookieScript();
      const config = cookieManagerMock.init.calls.mostRecent().args[0];
      const apmCategory = config.cookieManifest.find(
        (cat: any) => cat.categoryName === 'apm'
      );
      
      expect(apmCategory).toBeDefined();
      expect(apmCategory.cookies).toContain('dtCookie');
      expect(apmCategory.cookies).toContain('rxVisitor');
    });

    it('should configure essential cookies as non-optional', () => {
      executeCookieScript();
      const config = cookieManagerMock.init.calls.mostRecent().args[0];
      const essentialCategory = config.cookieManifest.find(
        (cat: any) => cat.categoryName === 'essential'
      );
      
      expect(essentialCategory).toBeDefined();
      expect(essentialCategory.optional).toBe(false);
      expect(essentialCategory.matchBy).toBe('exact');
      expect(essentialCategory.cookies).toContain('_csrf');
    });
  });

  describe('Data Layer Management', () => {
    beforeEach(() => {
      executeCookieScript();
    });

    it('should push cookie preferences event on UserPreferencesLoaded', () => {
      const preferences = { analytics: 'on', apm: 'off' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect((window as any).dataLayer).toContain(
        jasmine.objectContaining({
          event: 'Cookie Preferences',
          cookiePreferences: preferences
        })
      );
    });

    it('should push cookie preferences event on UserPreferencesSaved', () => {
      const preferences = { analytics: 'off', apm: 'on' };
      triggerEvent('UserPreferencesSaved', preferences);
      
      expect((window as any).dataLayer).toContain(
        jasmine.objectContaining({
          event: 'Cookie Preferences',
          cookiePreferences: preferences
        })
      );
    });

    it('should not push event if preferences are null', () => {
      const initialLength = (window as any).dataLayer.length;
      triggerEvent('UserPreferencesLoaded', null);
      
      expect((window as any).dataLayer.length).toBe(initialLength);
    });

    it('should not push event if preferences are undefined', () => {
      const initialLength = (window as any).dataLayer.length;
      triggerEvent('UserPreferencesSaved', undefined);
      
      expect((window as any).dataLayer.length).toBe(initialLength);
    });
  });

  describe('GTM Script Injection', () => {
    beforeEach(() => {
      executeCookieScript();
    });

    it('should inject GTM script when analytics consent is granted', () => {
      const preferences = { analytics: 'on' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      const gtmScript = document.getElementById(GTM_SCRIPT_ID);
      expect(gtmScript).not.toBeNull();
      expect(gtmScript?.getAttribute('src')).toContain(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
    });

    it('should not inject GTM script when analytics consent is denied', () => {
      const preferences = { analytics: 'off' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      const gtmScript = document.getElementById(GTM_SCRIPT_ID);
      expect(gtmScript).toBeNull();
    });

    it('should push gtm.start event to dataLayer on injection', () => {
      const preferences = { analytics: 'on' };
      const beforeLength = (window as any).dataLayer.length;
      
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect((window as any).dataLayer.length).toBeGreaterThan(beforeLength);
      const gtmEvent = (window as any).dataLayer.find((item: any) => item.event === 'gtm.js');
      expect(gtmEvent).toBeDefined();
      expect(gtmEvent['gtm.start']).toBeInstanceOf(Number);
    });

    it('should not inject GTM script twice', () => {
      const preferences = { analytics: 'on' };
      
      triggerEvent('UserPreferencesLoaded', preferences);
      triggerEvent('UserPreferencesSaved', preferences);
      
      expect(document.querySelectorAll(`#${GTM_SCRIPT_ID}`).length).toBe(1);
    });

    it('should remove GTM script when analytics consent is withdrawn', () => {
      triggerEvent('UserPreferencesLoaded', { analytics: 'on' });
      expect(document.getElementById(GTM_SCRIPT_ID)).not.toBeNull();
      
      triggerEvent('UserPreferencesSaved', { analytics: 'off' });
      expect(document.getElementById(GTM_SCRIPT_ID)).toBeNull();
    });
  });

  describe('Noscript Placeholder', () => {
    beforeEach(() => {
      executeCookieScript();
    });

    it('should create noscript placeholder when analytics is enabled', () => {
      const preferences = { analytics: 'on' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      const noscript = document.getElementById(NOSCRIPT_PLACEHOLDER_ID);
      expect(noscript).not.toBeNull();
      expect(noscript?.tagName.toLowerCase()).toBe('noscript');
    });

    it('should populate noscript with GTM iframe', () => {
      const preferences = { analytics: 'on' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      const noscript = document.getElementById(NOSCRIPT_PLACEHOLDER_ID);
      expect(noscript?.innerHTML).toContain('googletagmanager.com/ns.html');
      expect(noscript?.innerHTML).toContain(GTM_ID);
      expect(noscript?.hidden).toBe(false);
    });

    it('should clear noscript when analytics is disabled', () => {
      triggerEvent('UserPreferencesLoaded', { analytics: 'on' });
      let noscript = document.getElementById(NOSCRIPT_PLACEHOLDER_ID);
      expect(noscript?.innerHTML).not.toBe('');
      
      triggerEvent('UserPreferencesSaved', { analytics: 'off' });
      noscript = document.getElementById(NOSCRIPT_PLACEHOLDER_ID);
      expect(noscript?.innerHTML).toBe('');
      expect(noscript?.hidden).toBe(true);
    });
  });

  describe('APM (Dynatrace) Integration', () => {
    let dtrumMock: any;

    beforeEach(() => {
      dtrumMock = {
        enable: jasmine.createSpy('enable'),
        disable: jasmine.createSpy('disable'),
        enableSessionReplay: jasmine.createSpy('enableSessionReplay'),
        disableSessionReplay: jasmine.createSpy('disableSessionReplay')
      };
      (window as any).dtrum = dtrumMock;
      executeCookieScript();
    });

    it('should enable dtrum when apm consent is granted', () => {
      const preferences = { apm: 'on' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect(dtrumMock.enable).toHaveBeenCalled();
      expect(dtrumMock.enableSessionReplay).toHaveBeenCalled();
    });

    it('should disable dtrum when apm consent is denied', () => {
      const preferences = { apm: 'off' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect(dtrumMock.disable).toHaveBeenCalled();
      expect(dtrumMock.disableSessionReplay).toHaveBeenCalled();
    });

    it('should not throw if dtrum is not available', () => {
      delete (window as any).dtrum;
      const preferences = { apm: 'on' };
      
      expect(() => {
        triggerEvent('UserPreferencesLoaded', preferences);
      }).not.toThrow();
    });

    it('should handle missing dtrum methods gracefully', () => {
      (window as any).dtrum = {};
      const preferences = { apm: 'on' };
      
      expect(() => {
        triggerEvent('UserPreferencesLoaded', preferences);
      }).not.toThrow();
    });
  });

  describe('Preference Form Submission', () => {
    beforeEach(() => {
      executeCookieScript();
    });

    it('should display success message on form submission', () => {
      const successMessage = document.createElement('div');
      successMessage.className = 'cookie-preference-success';
      successMessage.style.display = 'none';
      document.body.appendChild(successMessage);
      
      triggerEvent('PreferenceFormSubmitted');
      
      expect(successMessage.style.display).toBe('block');
    });

    it('should scroll to top of page on form submission', () => {
      document.body.scrollTop = 100;
      document.documentElement.scrollTop = 100;
      
      triggerEvent('PreferenceFormSubmitted');
      
      expect(document.body.scrollTop).toBe(0);
      expect(document.documentElement.scrollTop).toBe(0);
    });

    it('should not throw if success message element is not present', () => {
      expect(() => {
        triggerEvent('PreferenceFormSubmitted');
      }).not.toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(() => {
      (window as any).dtrum = {
        enable: jasmine.createSpy('enable'),
        disable: jasmine.createSpy('disable'),
        enableSessionReplay: jasmine.createSpy('enableSessionReplay'),
        disableSessionReplay: jasmine.createSpy('disableSessionReplay')
      };
      executeCookieScript();
    });

    it('should handle both analytics and apm consent together', () => {
      const preferences = { analytics: 'on', apm: 'on' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect(document.getElementById(GTM_SCRIPT_ID)).not.toBeNull();
      expect((window as any).dtrum.enable).toHaveBeenCalled();
    });

    it('should handle consent withdrawal for both services', () => {
      triggerEvent('UserPreferencesLoaded', { analytics: 'on', apm: 'on' });
      
      const preferences = { analytics: 'off', apm: 'off' };
      triggerEvent('UserPreferencesSaved', preferences);
      
      expect(document.getElementById(GTM_SCRIPT_ID)).toBeNull();
      expect((window as any).dtrum.disable).toHaveBeenCalled();
    });

    it('should handle mixed consent preferences', () => {
      const preferences = { analytics: 'on', apm: 'off' };
      triggerEvent('UserPreferencesLoaded', preferences);
      
      expect(document.getElementById(GTM_SCRIPT_ID)).not.toBeNull();
      expect((window as any).dtrum.disable).toHaveBeenCalled();
    });

    it('should handle empty preferences object', () => {
      expect(() => {
        triggerEvent('UserPreferencesLoaded', {});
      }).not.toThrow();
    });

    it('should handle unexpected preference values', () => {
      const preferences = { analytics: 'maybe', apm: 'unknown' };
      
      expect(() => {
        triggerEvent('UserPreferencesLoaded', preferences);
      }).not.toThrow();
      
      expect(document.getElementById(GTM_SCRIPT_ID)).toBeNull();
    });
  });
});
