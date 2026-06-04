(function() {
  const COOKIE_NAME = 'ccpay-bubble-cookie-preferences';
  const GTM_ID = 'GTM-KPGLNSPT';
  const DATA_LAYER_NAME = 'dataLayer';
  const GTM_SCRIPT_ID = 'gtm-script';
  const NOSCRIPT_PLACEHOLDER_ID = 'gtm-noscript-placeholder';

  const cookieManager = window.cookieManager;
  if (!cookieManager) {
    return;
  }

  const ensureDataLayer = () => {
    window[DATA_LAYER_NAME] = window[DATA_LAYER_NAME] || [];
    return window[DATA_LAYER_NAME];
  };

  const pushPreferencesEvent = (preferences) => {
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

  const updateNoscriptPlaceholder = (enabled) => {
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

  const handleAnalyticsConsent = (preferences) => {
    if (preferences && preferences.analytics === 'on') {
      injectGtm();
    } else {
      removeGtm();
    }
  };

  const handleApmConsent = (preferences) => {
    const dtrum = window.dtrum;
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

  const onPreferencesChange = (preferences) => {
    pushPreferencesEvent(preferences);
    handleAnalyticsConsent(preferences);
    handleApmConsent(preferences);
  };

  cookieManager.on('UserPreferencesLoaded', onPreferencesChange);
  cookieManager.on('UserPreferencesSaved', onPreferencesChange);

  cookieManager.on('PreferenceFormSubmitted', () => {
    const message = document.querySelector('.cookie-preference-success');
    if (message) {
      message.style.display = 'block';
    }
    if (document.body) {
      document.body.scrollTop = 0; // For Safari
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
        cookies: [
          '_ga',
          '_gid',
          '_gat_UA-'
        ]
      },
      {
        categoryName: 'apm',
        cookies: [
          'dtCookie',
          'dtLatC',
          'dtPC',
          'dtSa',
          'rxVisitor',
          'rxvt'
        ]
      },
      {
        categoryName: 'essential',
        optional: false,
        matchBy: 'exact',
        cookies: [
          '_csrf',
          '__user-info',
          '__site-id'
        ]
      },
    ]
  };

  cookieManager.init(config);
  ensureDataLayer();
})();
