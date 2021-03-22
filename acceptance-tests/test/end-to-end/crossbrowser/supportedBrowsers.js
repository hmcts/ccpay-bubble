const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': { name: 'FeeAndPay: WIN_CHROME_LATEST' }
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': { name: 'FeeAndPay: MAC_CHROME_LATEST' }
    }
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': { name: 'FeeAndPay: WIN_FIREFOX_LATEST' }
    }
  }
};

module.exports = supportedBrowsers;
