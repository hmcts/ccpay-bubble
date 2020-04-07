const config = require('config');
const appInsights = require('applicationinsights');

module.exports = {
  enable() {
    appInsights.setup(config.get('secrets.ccpay.AppInsightsInstrumentationKey'))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, true);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get('appInsights.roleName');
    appInsights.start();
    return appInsights;
  }
};
