import * as config from 'config';
import * as appInsights from 'applicationinsights';

export class AppInsights {
  static enable () {
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get<string>('appInsights.roleName');
    appInsights.setup(config.get<string>('appInsights.instrumentationKey'))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true, true)
      .start();
  }
}
