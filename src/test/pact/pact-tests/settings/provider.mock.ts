// i//mport pact from "@pact-foundation/pact-node"

// //import { Pact } from '@pact-foundation/pact'
// const Pact = require('@pact-foundation/pact')
// var path = require('path')

'use strict';

const expect = require('chai').expect;
const path = require('path');
const { Pact } = require('@pact-foundation/pact');

export interface PactTestSetupConfig {
  provider: string;
  port: number;
}

export class PactTestSetup {

  provider: typeof Pact;
  port: number;

  constructor(config: PactTestSetupConfig) {
    this.provider = new Pact({
      consumer: 'cc_paybuble_frontend',
      dir: path.resolve(process.cwd(), 'src/test/pact/pacts'),
      log: path.resolve(process.cwd(), 'src/test/pact/logs', 'mockserver-integration.log'),
      logLevel: 'info',
      pactfileWriteMode: 'merge',
      port: this.port,
      provider: config.provider,
      spec: 2,
    });
  }
}
