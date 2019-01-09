exports.config = {
  name: 'ccpaybubble-smoke-test',
  tests: './test/smoke-test.js',
  timeout: 10000,
  output: './output',
  helpers: {
    Puppeteer: {
      url: `${TEST_URL}/health`,
      show: false,
      restart: false,
      keepCookies: false,
      keepBrowserState: true,
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
      timeout: 3000000,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--proxy-server=proxyout.reform.hmcts.net:8080',
          '--proxy-bypass-list=*beta*LB.reform.hmcts.net'
        ]
      }
    }
  },
  mocha: {
    reporterOptions: {
      mochaFile: 'output/result.xml',
      reportDir: 'output'
    }
  },
  Mochawesome: { uniqueScreenshotNames: 'true' },
  bootstrap: false
};