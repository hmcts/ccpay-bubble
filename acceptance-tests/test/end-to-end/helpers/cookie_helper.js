/**
 * Cookie Helper for E2E Tests
 * 
 * Since the application now uses @hmcts/cookie-manager, tests need to handle
 * cookie preferences to prevent the cookie banner from interfering with test flows.
 * 
 * This helper sets cookie preferences automatically to suppress the banner during tests.
 */

/**
 * Sets cookie preferences to prevent the cookie banner from appearing during tests.
 * By default, sets analytics and apm cookies to 'off' to avoid GTM tracking during tests.
 * 
 * @param {CodeceptJS.I} I - CodeceptJS actor instance
 * @param {Object} preferences - Optional custom preferences (default: { analytics: 'off', apm: 'off' })
 */
const setCookiePreferences = async (I, preferences = { analytics: 'off', apm: 'off' }) => {
  await I.executeScript((prefs) => {
    const cookieName = 'ccpay-bubble-cookie-preferences';
    const preferencesJson = JSON.stringify(prefs);
    document.cookie = `${cookieName}=${encodeURIComponent(preferencesJson)}; path=/; max-age=31536000`;
  }, preferences);
};

/**
 * Dismisses the cookie banner if it's currently visible by clicking reject.
 * Use this if you need to handle the banner explicitly during a test.
 * 
 * @param {CodeceptJS.I} I - CodeceptJS actor instance
 */
const dismissCookieBanner = async (I) => {
  const bannerVisible = await I.executeScript(() => {
    const banner = document.querySelector('.cookie-banner');
    return banner && !banner.hidden;
  });
  
  if (bannerVisible) {
    await I.executeScript(() => {
      const rejectButton = document.querySelector('.cookie-banner-reject-button');
      if (rejectButton) {
        rejectButton.click();
      }
    });
  }
};

/**
 * Clears all cookie preferences.
 * Useful for testing cookie banner behavior specifically.
 * 
 * @param {CodeceptJS.I} I - CodeceptJS actor instance
 */
const clearCookiePreferences = async (I) => {
  await I.executeScript(() => {
    const cookieName = 'ccpay-bubble-cookie-preferences';
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });
};

module.exports = {
  setCookiePreferences,
  dismissCookieBanner,
  clearCookiePreferences
};
