const config = require('@hmcts/properties-volume').addTo(require('config'));
const security = require('./express/infrastructure/security-factory');
const { enable } = require('./app-insights');

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
const appInsights = enable();
appInsights.setAuthenticatedUserContext = userId => {
  const validatedId = userId.replace(/[,;=| ]+/g, '_');
  const key = appInsights.defaultClient.context.keys.userAuthUserId;
  appInsights.defaultClient.context.tags[key] = validatedId;
};

const app = require('./server')(security(appInsights), appInsights),
  fs = require('fs'),
  defaultPort = '3000',
  port = process.env.PORT || defaultPort,
  https = require('https'),
  http = require('http');

// reverse proxy handles tls in non local environments

// if (process.env.NODE_ENV === 'development') {
//   const crtLocation = config.get('certs.crt'),
//     keyLocation = config.get('certs.key'),
//     cert = fs.readFileSync(crtLocation),
//     key = fs.readFileSync(keyLocation);
//   https.createServer({ key, cert }, app).listen(port);
// } else {
  http.createServer(app).listen(port);
// }