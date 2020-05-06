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
  defaultPort = '3000',
  port = process.env.PORT || defaultPort,
  http = require('http');

// Disable cert errors

// SSL handled at IIS level so Node.js app (iisnode) should be http only.
http.createServer(app).listen(port);
