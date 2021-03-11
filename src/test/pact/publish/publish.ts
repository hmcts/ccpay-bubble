import pact from '@pact-foundation/pact-node';
import * as git from 'git-rev-sync';
import * as path from 'path';

const config = require('config');
const publish = async (): Promise<void> => {
  try {

    const pactBroker = config.get('pact.brokerUrl') ?
    config.get('pact.brokerUrl') : 'http://localhost:80';

    const pactTag = config.get('pact.branchName') ?
    config.get('pact.branchName') : 'Dev';

    const consumerVersion = config.get('pact.consumerVersion') !== '' ?
      // @ts-ignore
      config.get('pact.consumerVersion') : git.short();

    const certPath = path.resolve(__dirname, '../cer/ca-bundle.crt');
    process.env.SSL_CERT_FILE = certPath;

    const opts = {
      consumerVersion,
      pactBroker,
      pactBrokerPassword: '',
      pactBrokerUsername: '',
      pactFilesOrDirs: [
        path.resolve(__dirname, '../pacts/'),
      ],
      publishVerificationResult: true,
      tags: [pactTag],
    };

    await pact.publishPacts(opts);

    console.log('Pact contract publishing complete!');
    console.log('');
    console.log(`Head over to ${pactBroker}`);
    console.log('to see your published contracts.');

  } catch (e) {
    console.log('Pact contract publishing failed: ', e);
  }
};

(async () => {
  await publish();
})();
