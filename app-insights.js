const config = require('config');
const appInsights = require('applicationinsights');
const EMPTY_CONNECTION_STRING = 'InstrumentationKey=00000000-0000-0000-0000-000000000000';
const CLOUD_ROLE_NAME = 'ccpay-bubble-frontend';

function createNoopAppInsights() {
  return {
    defaultClient: null,
    setAuthenticatedUserContext() {}
  };
}

function fineGrainedSampling(envelope) {
  const baseType = envelope && envelope.data && envelope.data.baseType;
  const name = envelope && envelope.data && envelope.data.baseData && envelope.data.baseData.name;

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
      const connectionString = config.get('secrets.ccpay.app-insights-connection-string');

      if (!connectionString || connectionString === EMPTY_CONNECTION_STRING) {
        return createNoopAppInsights();
      }

      // App Insights 3.x uses OpenTelemetry resource/service.name for cloud role mapping.
      process.env.OTEL_SERVICE_NAME = CLOUD_ROLE_NAME;

      appInsights.setup(connectionString)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectConsole(true, true);

      if (appInsights.defaultClient &&
        appInsights.defaultClient.context &&
        appInsights.defaultClient.context.tags &&
        appInsights.defaultClient.context.keys &&
        appInsights.defaultClient.context.keys.cloudRole) {
        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = CLOUD_ROLE_NAME;
      }

      if (appInsights.defaultClient && appInsights.defaultClient.addTelemetryProcessor) {
        appInsights.defaultClient.addTelemetryProcessor(fineGrainedSampling);
      }

      appInsights.start();
    } catch (error) {
      // Telemetry must never prevent application startup.
      // eslint-disable-next-line no-console
      console.warn('Application Insights initialization failed, continuing without telemetry', error && error.message ? error.message : error);
      return createNoopAppInsights();
    }

    return appInsights;
  }
};
