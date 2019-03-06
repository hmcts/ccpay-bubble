const security = require('./express/infrastructure/security-factory');
const { enable } = require('./app-insights');

const appInsights = enable();
appInsights.setAuthenticatedUserContext = userId => {
  const validatedId = userId.replace(/[,;=| ]+/g, '_');
  const key = appInsights.defaultClient.context.keys.userAuthUserId;
  appInsights.defaultClient.context.tags[key] = validatedId;
};

const app = require('./server')(security(appInsights), appInsights),
  config = require('config'),
  fs = require('fs'),
  defaultPort = '3000',
  port = process.env.PORT || defaultPort,
  https = require('https'),
  http = require('http');

// Disable cert errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// SSL handled at IIS level so Node.js app (iisnode) should be http only.
if (process.env.IGNORE_CERTS) {
  http.createServer(app).listen(port);
} else {
  const crtLocation = config.get('certs.crt'),
    keyLocation = config.get('certs.key'),
    cert = fs.readFileSync(crtLocation),
    key = fs.readFileSync(keyLocation);
  https.createServer({ key, cert }, app).listen(port);
}
