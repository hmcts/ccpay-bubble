'use strict';

const assert = require('assert');
const utils = require('./utils');

describe('utils IDAM token config', () => {
  it('fails before requesting an IDAM token when credentials are missing', () => {
    assert.throws(
      () => utils._private.validateIDAMTokenConfig(undefined, 'password', 'client', 'secret', 'redirect', 'probate user'),
      /IDAM token request skipped \(probate user\): missing username/
    );
  });

  it('does not report missing config when required IDAM values are present', () => {
    assert.doesNotThrow(() => utils._private.validateIDAMTokenConfig(
      'user@example.com',
      'password',
      'client',
      'secret',
      'redirect',
      'probate user'
    ));
  });
});

describe('utils API polling', () => {
  it('returns the first truthy poll result', async () => {
    let currentTime = 0;
    const attempts = [];

    const result = await utils._private.pollUntil('test result', async attempt => {
      attempts.push(attempt);
      return attempt === 3 ? {ready: true} : false;
    }, {
      timeoutMs: 10000,
      intervalMs: 1000,
      nowFn: () => currentTime,
      sleepFn: async ms => {
        currentTime += ms;
      }
    });

    assert.deepStrictEqual(result, {ready: true});
    assert.deepStrictEqual(attempts, [1, 2, 3]);
  });

  it('fails with the waited-for contract when polling times out', async () => {
    let currentTime = 0;

    await assert.rejects(
      () => utils._private.pollUntil('PBA payment for CCD case 123', async () => false, {
        timeoutMs: 2000,
        intervalMs: 1000,
        nowFn: () => currentTime,
        sleepFn: async ms => {
          currentTime += ms;
        }
      }),
      /Timed out waiting for PBA payment for CCD case 123 after 2000ms/
    );
  });

  it('normalises missing payment lookup payloads to an empty list', () => {
    assert.deepStrictEqual(utils._private.paymentsFromLookup(undefined), []);
    assert.deepStrictEqual(utils._private.paymentsFromLookup({}), []);
    assert.deepStrictEqual(utils._private.paymentsFromLookup({payments: [{payment_reference: 'RC-1'}]}), [
      {payment_reference: 'RC-1'}
    ]);
  });

  it('polls payment lookup until a payment is visible for the CCD case', async () => {
    let currentTime = 0;
    const seenCcdCaseNumbers = [];

    const result = await utils._private.waitForPBAPaymentByCCDCaseNumber('idam-token', 'service-token', '1783', {
      timeoutMs: 10000,
      intervalMs: 1000,
      nowFn: () => currentTime,
      sleepFn: async ms => {
        currentTime += ms;
      },
      lookupFn: async (idamToken, serviceToken, ccdCaseNumber) => {
        assert.strictEqual(idamToken, 'idam-token');
        assert.strictEqual(serviceToken, 'service-token');
        seenCcdCaseNumbers.push(ccdCaseNumber);

        if (seenCcdCaseNumbers.length < 3) {
          return {payments: []};
        }

        return {payments: [{payment_reference: 'RC-1783'}]};
      }
    });

    assert.deepStrictEqual(result, {payments: [{payment_reference: 'RC-1783'}]});
    assert.deepStrictEqual(seenCcdCaseNumbers, ['1783', '1783', '1783']);
  });
});
