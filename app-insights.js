const config = require('config');
const appInsights = require('applicationinsights');

function fineGrainedSampling(envelope) {
  if (
    ['RequestData', 'RemoteDependencyData'].includes(envelope.data.baseType) &&
    envelope.data.baseData.name.includes('/health')
  ) {
    envelope.sampleRate = 1;
  }

  return true;
}

module.exports = {
  enable() {
    appInsights.setup(config.get('secrets.ccpay.AppInsightsInstrumentationKey'))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, true);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get('appInsights.roleName');
    appInsights.defaultClient.addTelemetryProcessor(fineGrainedSampling);
    appInsights.start();
    return appInsights;
  }
};
