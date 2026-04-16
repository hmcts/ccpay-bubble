const config = require('config');
const appInsights = require('applicationinsights');

function fineGrainedSampling(envelope) {
  const baseType = envelope?.data?.baseType;
  const name = envelope?.data?.baseData?.name;

  if (
    ['RequestData', 'RemoteDependencyData'].includes(baseType) &&
    typeof name === 'string' &&
    name.includes('/health')
  ) {
    envelope.sampleRate = 1;
  }

  return true;
}

module.exports = {
  enable() {
    try {
      const instrumentationKey = config.get('secrets.ccpay.AppInsightsInstrumentationKey');
      appInsights.setup(instrumentationKey)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectConsole(true, true);

      if (appInsights.defaultClient?.context?.tags && appInsights.defaultClient?.context?.keys?.cloudRole) {
        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get('appInsights.roleName');
      }

      if (appInsights.defaultClient?.addTelemetryProcessor) {
        appInsights.defaultClient.addTelemetryProcessor(fineGrainedSampling);
      }

      appInsights.start();
    } catch (error) {
      // Telemetry must never prevent application startup.
      // eslint-disable-next-line no-console
      console.warn('Application Insights initialization failed, continuing without telemetry', error?.message || error);
    }

    return appInsights;
  }
};
