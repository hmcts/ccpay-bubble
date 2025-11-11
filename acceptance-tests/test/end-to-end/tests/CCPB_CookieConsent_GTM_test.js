/* eslint-disable */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('Cookie consent and GTM injection test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('GTM script should not be present before user accepts analytics cookies',
  async ({ I }) => {
    I.amOnPage('/');
    I.waitForElement('app-root', 10);

    // Verify GTM script is not injected before consent
    const gtmScriptExists = await I.executeScript(() => {
      return document.getElementById('gtm-script') !== null;
    });
    I.assertFalse(gtmScriptExists, 'GTM script should not be present before consent');

    // Verify GTM noscript placeholder is hidden
    const noscriptHidden = await I.executeScript(() => {
      const placeholder = document.getElementById('gtm-noscript-placeholder');
      return placeholder ? placeholder.hidden : true;
    });
    I.assertTrue(noscriptHidden, 'GTM noscript placeholder should be hidden before consent');
  });

Scenario('GTM script should be injected after user accepts analytics cookies',
  async ({ I }) => {
    I.amOnPage('/');
    I.waitForElement('app-root', 10);

    // Accept all cookies via cookie banner (adjust selectors based on actual implementation)
    // This is a placeholder - you'll need to update with actual cookie banner selectors
    const cookieBannerExists = await I.executeScript(() => {
      return document.querySelector('.cookie-banner') !== null ||
             document.querySelector('[class*="cookie"]') !== null;
    });

    if (cookieBannerExists) {
      // Click accept button (update selector based on your cookie banner implementation)
      try {
        I.click('Accept all cookies');
      } catch (e) {
        // Alternative: programmatically set consent
        I.executeScript(() => {
          window.cookieManager.setPreferences({ analytics: 'on', apm: 'on' });
        });
      }
    } else {
      // Programmatically set consent if no banner present
      I.executeScript(() => {
        if (window.cookieManager && window.cookieManager.setPreferences) {
          window.cookieManager.setPreferences({ analytics: 'on', apm: 'on' });
        }
      });
    }

    // Wait a moment for GTM to inject
    I.wait(2);

    // Verify GTM script was injected
    const gtmScriptExists = await I.executeScript(() => {
      const script = document.getElementById('gtm-script');
      return script !== null && script.src.includes('googletagmanager.com/gtm.js');
    });
    I.assertTrue(gtmScriptExists, 'GTM script should be present after analytics consent');

    // Verify dataLayer exists
    const dataLayerExists = await I.executeScript(() => {
      return Array.isArray(window.dataLayer) && window.dataLayer.length > 0;
    });
    I.assertTrue(dataLayerExists, 'dataLayer should be initialized');

    // Verify GTM ID is correct
    const gtmIdCorrect = await I.executeScript(() => {
      const script = document.getElementById('gtm-script');
      return script ? script.src.includes('GTM-KPGLNSPT') : false;
    });
    I.assertTrue(gtmIdCorrect, 'GTM script should have correct container ID');
  });

Scenario('GTM script should be removed when user rejects analytics cookies',
  async ({ I }) => {
    I.amOnPage('/');
    I.waitForElement('app-root', 10);

    // First, set consent to on
    I.executeScript(() => {
      if (window.cookieManager && window.cookieManager.setPreferences) {
        window.cookieManager.setPreferences({ analytics: 'on', apm: 'on' });
      }
    });
    I.wait(2);

    // Verify GTM is present
    let gtmScriptExists = await I.executeScript(() => {
      return document.getElementById('gtm-script') !== null;
    });
    I.assertTrue(gtmScriptExists, 'GTM script should be present after consent');

    // Now revoke consent
    I.executeScript(() => {
      if (window.cookieManager && window.cookieManager.setPreferences) {
        window.cookieManager.setPreferences({ analytics: 'off', apm: 'off' });
      }
    });
    I.wait(1);

    // Verify GTM script was removed
    gtmScriptExists = await I.executeScript(() => {
      return document.getElementById('gtm-script') !== null;
    });
    I.assertFalse(gtmScriptExists, 'GTM script should be removed after revoking consent');
  });

Scenario('Cookie Preferences event should be pushed to dataLayer',
  async ({ I }) => {
    I.amOnPage('/');
    I.waitForElement('app-root', 10);

    // Set preferences
    I.executeScript(() => {
      if (window.cookieManager && window.cookieManager.setPreferences) {
        window.cookieManager.setPreferences({ analytics: 'on', apm: 'off' });
      }
    });
    I.wait(1);

    // Check dataLayer for Cookie Preferences event
    const eventPushed = await I.executeScript(() => {
      if (!window.dataLayer) return false;
      return window.dataLayer.some(item =>
        item.event === 'Cookie Preferences' &&
        item.cookiePreferences &&
        item.cookiePreferences.analytics === 'on'
      );
    });
    I.assertTrue(eventPushed, 'Cookie Preferences event should be in dataLayer');
  });
