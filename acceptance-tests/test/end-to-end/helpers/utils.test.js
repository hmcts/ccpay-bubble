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

describe('utils request retries', () => {
  const okResponse = {ok: true, status: 200, statusText: 'OK', url: 'http://service/health'};

  it('returns the first successful response', async () => {
    const attempts = [];

    const resp = await utils._private.makeRequestWithRetry(async () => {
      attempts.push(Date.now());
      return okResponse;
    }, {url: 'http://service/health', sleepFn: async () => {}});

    assert.strictEqual(resp, okResponse);
    assert.strictEqual(attempts.length, 1);
  });

  it('retries gateway errors until the service responds', async () => {
    const statuses = [503, 504, 200];
    const waits = [];

    const resp = await utils._private.makeRequestWithRetry(async () => {
      const status = statuses.shift();
      return status === 200 ? okResponse : {ok: false, status, statusText: 'Gateway Time-out', url: 'http://service/x'};
    }, {url: 'http://service/x', attempts: 5, intervalMs: 1000, sleepFn: async ms => waits.push(ms)});

    assert.strictEqual(resp, okResponse);
    assert.deepStrictEqual(waits, [1000, 2000]);
  });

  it('retries transport errors and gives up with the last failure', async () => {
    let calls = 0;

    await assert.rejects(
      () => utils._private.makeRequestWithRetry(async () => {
        calls++;
        throw new Error('request to http://service/x failed, reason: connect ECONNREFUSED');
      }, {url: 'http://service/x', attempts: 3, intervalMs: 10, sleepFn: async () => {}}),
      /ECONNREFUSED/
    );

    assert.strictEqual(calls, 3);
  });

  it('does not retry a client error response', async () => {
    let calls = 0;

    await assert.rejects(
      () => utils._private.makeRequestWithRetry(async () => {
        calls++;
        return {ok: false, status: 400, statusText: 'Bad Request', url: 'http://service/x'};
      }, {url: 'http://service/x', attempts: 5, intervalMs: 10, sleepFn: async () => {}}),
      /Fetch failed 400 : Bad Request : http:\/\/service\/x/
    );

    assert.strictEqual(calls, 1);
  });

  it('reports the final gateway error once the attempts are exhausted', async () => {
    await assert.rejects(
      () => utils._private.makeRequestWithRetry(
        async () => ({ok: false, status: 504, statusText: 'Gateway Time-out', url: 'http://service/x'}),
        {url: 'http://service/x', attempts: 2, intervalMs: 10, sleepFn: async () => {}}
      ),
      /Fetch failed 504 : Gateway Time-out : http:\/\/service\/x/
    );
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
