
window.cookieManager.on('UserPreferencesLoaded', (preferences) => {
    var dataLayer = window.dataLayer || [];
    dataLayer.push({ 'event': 'Cookie Preferences', 'cookiePreferences': preferences });
  });

  window.cookieManager.on('UserPreferencesSaved', (preferences) => {
    var dataLayer = window.dataLayer || [];
    var dtrum = window.dtrum;

    dataLayer.push({ 'event': 'Cookie Preferences', 'cookiePreferences': preferences });

    if (dtrum !== undefined) {
      if (preferences.apm === 'on') {
        dtrum.enable();
        dtrum.enableSessionReplay();
      } else {
        dtrum.disableSessionReplay();
        dtrum.disable();
      }
    }
  });

  window.cookieManager.on('PreferenceFormSubmitted', () => {
    const message = document.querySelector('.cookie-preference-success');
    message.style.display = 'block';
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });


  var config = {
    userPreferences: {
      cookieName: 'ccpay-bubble-cookie-preferences',
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

  window.cookieManager.init(config);
