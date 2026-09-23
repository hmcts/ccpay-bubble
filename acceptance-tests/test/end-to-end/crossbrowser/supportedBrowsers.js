/* eslint-disable object-curly-newline */
const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
  // This is safari browser
  webkit: [
    {
      name: 'webkit',
      browser: 'webkit',
      windowSize: '1024x768',
    },
  ],
  chromium: [
    {
      name: 'chromium',
      browser: 'chromium',
      windowSize: '1024x768',
    },
  ],
  firefox: [
    {
      name: 'firefox',
      browser: 'firefox',
      windowSize: '1024x768',
    }
  ]
};

module.exports = supportedBrowsers;
