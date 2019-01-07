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
http.createServer(app).listen(port);
