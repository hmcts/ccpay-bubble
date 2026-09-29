'use strict';

const assert = require('assert');
const pa11yScript = require('./pa11y');

describe('pa11y setup', () => {
  const requiredVars = [
    'PROBATE_CASE_WORKER_USER_NAME',
    'PROBATE_CASE_WORKER_PASSWORD',
    'OAUTH2_CLIENT_SECRET'
  ];

  let originalValues;

  beforeEach(() => {
    originalValues = {};
    for (const envVar of requiredVars) {
      originalValues[envVar] = process.env[envVar];
      delete process.env[envVar];
    }
  });

  afterEach(() => {
    for (const envVar of requiredVars) {
      if (originalValues[envVar] === undefined) {
        delete process.env[envVar];
      } else {
        process.env[envVar] = originalValues[envVar];
      }
    }
  });

  it('reports missing setup variables before pa11y creates test data', () => {
    assert.deepStrictEqual(pa11yScript.missingPa11ySetupVars(), requiredVars);
  });

  it('does not report missing setup variables when pa11y is configured', () => {
    for (const envVar of requiredVars) {
      process.env[envVar] = 'configured';
    }

    assert.deepStrictEqual(pa11yScript.missingPa11ySetupVars(), []);
  });
});
