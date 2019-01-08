import * as config from 'config';
import * as appInsights from 'applicationinsights';

module.exports = {
  enable() {
    const ikey = config.get('appInsights.instrumentationKey');
    appInsights.setup(ikey)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .setInternalLogging(true, true)
      .start();
    return appInsights;
  }
};
