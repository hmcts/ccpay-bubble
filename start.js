const config = require('@hmcts/properties-volume').addTo(require('config'));
const security = require('./express/infrastructure/security-factory');
const { enable } = require('./app-insights');

process.on('uncaughtException', error => {
  console.error('Uncaught exception during startup', error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection during startup', error);
  process.exit(1);
});

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
const appInsights = enable();
appInsights.setAuthenticatedUserContext = userId => {
  const validatedId = userId.replace(/[,;=| ]+/g, '_');

  if (
    appInsights.defaultClient &&
    appInsights.defaultClient.context &&
    appInsights.defaultClient.context.keys &&
    appInsights.defaultClient.context.tags
  ) {
    const key = appInsights.defaultClient.context.keys.userAuthUserId;
    appInsights.defaultClient.context.tags[key] = validatedId;
  }
};

try {
  const app = require('./server')(security(appInsights), appInsights),
    fs = require('fs'),
    defaultPort = '3000',
    port = process.env.PORT || defaultPort,
    http = require('http');

  http.createServer(app).listen(port);
} catch (error) {
  console.error('Failed to start application', error);
  process.exit(1);
}
