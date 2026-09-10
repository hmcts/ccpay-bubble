'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.CODECEPT_AUTH_CACHE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'ccpay-auth-cache-test-'));
process.env.CODECEPT_AUTH_CACHE_TTL_MS = '60000';

const authCache = require('./local_auth_cache');

describe('local auth cache', () => {
  after(() => {
    fs.rmSync(process.env.CODECEPT_AUTH_CACHE_DIR, { recursive: true, force: true });
    delete process.env.CODECEPT_AUTH_CACHE_DIR;
    delete process.env.CODECEPT_AUTH_CACHE_TTL_MS;
  });

  it('reuses a locally stored value for the same cache key', async () => {
    let calls = 0;
    const key = ['reuse', Date.now()];

    const first = await authCache.getOrCreate(key, async () => {
      calls += 1;
      return 'token-1';
    });
    const second = await authCache.getOrCreate(key, async () => {
      calls += 1;
      return 'token-2';
    });

    assert.strictEqual(first, 'token-1');
    assert.strictEqual(second, 'token-1');
    assert.strictEqual(calls, 1);
  });

  it('refreshes expired cache entries', async () => {
    let calls = 0;
    const key = ['expired', Date.now()];
    const filePath = authCache._private.cachePath(key);
    authCache._private.writeCache(filePath, 'old-token', -1);

    const value = await authCache.getOrCreate(key, async () => {
      calls += 1;
      return 'new-token';
    });

    assert.strictEqual(value, 'new-token');
    assert.strictEqual(calls, 1);
  });

  it('creates the cache directory before taking the lock', async () => {
    const originalDir = process.env.CODECEPT_AUTH_CACHE_DIR;
    const missingDir = path.join(originalDir, 'missing-cache-dir');
    fs.rmSync(missingDir, { recursive: true, force: true });
    process.env.CODECEPT_AUTH_CACHE_DIR = missingDir;

    try {
      const value = await authCache.getOrCreate(['missing-dir', Date.now()], async () => 'token');
      assert.strictEqual(value, 'token');
      assert.ok(fs.existsSync(missingDir));
    } finally {
      process.env.CODECEPT_AUTH_CACHE_DIR = originalDir;
      fs.rmSync(missingDir, { recursive: true, force: true });
    }
  });

  it('coalesces concurrent creators for the same cache key', async () => {
    let calls = 0;
    const key = ['concurrent', Date.now()];

    const values = await Promise.all([
      authCache.getOrCreate(key, async () => {
        calls += 1;
        await new Promise(resolve => setTimeout(resolve, 20));
        return 'shared-token';
      }),
      authCache.getOrCreate(key, async () => {
        calls += 1;
        return 'duplicate-token';
      })
    ]);

    assert.deepStrictEqual(values, ['shared-token', 'shared-token']);
    assert.strictEqual(calls, 1);
  });

  it('does not treat an active lock as stale during the wait budget', () => {
    assert.ok(authCache._private.lockStaleMs > authCache._private.lockWaitMs);
  });

  it('waits long enough for one Jenkins login to seed the shared cache', () => {
    assert.ok(authCache._private.lockWaitMs >= 4 * 60 * 1000);
  });

  it('invalidates a locally stored value', async () => {
    const key = ['invalidate', Date.now()];
    await authCache.getOrCreate(key, async () => 'old-token');

    authCache.invalidate(key);
    const value = await authCache.getOrCreate(key, async () => 'new-token');

    assert.strictEqual(value, 'new-token');
  });

  it('logs cache decisions only when debug is enabled', async () => {
    const originalLog = console.log;
    const logs = [];
    console.log = message => logs.push(message);

    try {
      await authCache.getOrCreate(['debug-off', Date.now()], async () => 'quiet-token');
      assert.deepStrictEqual(logs, []);

      process.env.CODECEPT_AUTH_CACHE_DEBUG = 'true';
      const key = ['debug-on', Date.now()];
      await authCache.getOrCreate(key, async () => 'debug-token');
      await authCache.getOrCreate(key, async () => 'unused-token');

      assert.ok(logs.some(line => line.includes('[auth-cache] miss:create ')));
      assert.ok(logs.some(line => line.includes('[auth-cache] stored ')));
      assert.ok(logs.some(line => line.includes('[auth-cache] hit:memory ')));
    } finally {
      console.log = originalLog;
      delete process.env.CODECEPT_AUTH_CACHE_DEBUG;
    }
  });
});
