const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
  // This is safari browser
  webkit: {
    webkit_mac_latest: {
      browserName: 'webkit',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Mac_webkit_latest',
        screenResolution: '1400x1050',
      },
    },
  },
  chromium: {
    chromium_win_latest: {
      browserName: 'chromium',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Win_chromium_latest',
      },
    },
    chromium_mac_latest: {
      browserName: 'chromium',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Mac_chromium_latest',
      },
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Win_Firefox_latest',
      },
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Mac_Firefox_latest',
      },
    },
  },
};

module.exports = supportedBrowsers;
