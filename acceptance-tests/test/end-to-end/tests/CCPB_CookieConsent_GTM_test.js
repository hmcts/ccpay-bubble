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

    // Wait for cookie banner to become visible (cookie manager shows it if no preference cookie exists)
    I.wait(1);

    // Try to click the accept button if cookie banner is visible
    const accepted = await I.executeScript(() => {
      const banner = document.querySelector('.cookie-banner');
      const acceptButton = document.querySelector('.cookie-banner-accept-button');
      
      // Check if banner is visible (not hidden)
      if (banner && !banner.hidden && acceptButton) {
        acceptButton.click();
        return true;
      }
      
      // Fallback: manually set cookie and reload to trigger service initialization
      const cookieName = 'ccpay-bubble-cookie-preferences';
      const preferences = JSON.stringify({ analytics: 'on', apm: 'on' });
      document.cookie = `${cookieName}=${encodeURIComponent(preferences)}; path=/; max-age=31536000`;
      return false;
    });

    // If we used fallback, reload page to trigger service event handlers
    if (!accepted) {
      I.amOnPage('/');
      I.waitForElement('app-root', 10);
    }

    // Wait for GTM to inject
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
    // First visit: Accept cookies
    I.amOnPage('/');
    I.waitForElement('app-root', 10);
    I.wait(1);

    // Accept cookies
    const accepted = await I.executeScript(() => {
      const banner = document.querySelector('.cookie-banner');
      const acceptButton = document.querySelector('.cookie-banner-accept-button');
      
      if (banner && !banner.hidden && acceptButton) {
        acceptButton.click();
        return true;
      }
      
      const cookieName = 'ccpay-bubble-cookie-preferences';
      const preferences = JSON.stringify({ analytics: 'on', apm: 'on' });
      document.cookie = `${cookieName}=${encodeURIComponent(preferences)}; path=/; max-age=31536000`;
      return false;
    });

    if (!accepted) {
      I.amOnPage('/');
      I.waitForElement('app-root', 10);
    }
    
    I.wait(2);

    // Verify GTM is present
    let gtmScriptExists = await I.executeScript(() => {
      return document.getElementById('gtm-script') !== null;
    });
    I.assertTrue(gtmScriptExists, 'GTM script should be present after consent');

    // Now navigate to cookies page and change preferences to reject
    I.amOnPage('/cookies');
    I.waitForElement('.cookie-preferences-form', 5);
    
    // Select "Do not use cookies" for analytics
    I.executeScript(() => {
      const analyticsOffRadio = document.querySelector('input[name="analytics"][value="off"]');
      if (analyticsOffRadio) {
        analyticsOffRadio.checked = true;
      }
      const apmOffRadio = document.querySelector('input[name="apm"][value="off"]');
      if (apmOffRadio) {
        apmOffRadio.checked = true;
      }
      
      // Submit the form
      const form = document.querySelector('.cookie-preferences-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
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
    I.wait(1);

    // Click accept button or set preferences
    const accepted = await I.executeScript(() => {
      const banner = document.querySelector('.cookie-banner');
      const acceptButton = document.querySelector('.cookie-banner-accept-button');
      
      if (banner && !banner.hidden && acceptButton) {
        acceptButton.click();
        return true;
      }
      
      const cookieName = 'ccpay-bubble-cookie-preferences';
      const preferences = JSON.stringify({ analytics: 'on', apm: 'on' });
      document.cookie = `${cookieName}=${encodeURIComponent(preferences)}; path=/; max-age=31536000`;
      return false;
    });

    if (!accepted) {
      I.amOnPage('/');
      I.waitForElement('app-root', 10);
    }
    
    I.wait(1);

    // Check dataLayer for Cookie Preferences event
    const eventPushed = await I.executeScript(() => {
      if (!window.dataLayer) return false;
      return window.dataLayer.some(item =>
        item.event === 'Cookie Preferences' &&
        item.cookiePreferences &&
        (item.cookiePreferences.analytics === 'on' || item.cookiePreferences.analytics === 'off')
      );
    });
    I.assertTrue(eventPushed, 'Cookie Preferences event should be in dataLayer');
  });
