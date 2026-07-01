'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_TTL_MS = 4 * 60 * 1000;
const LOCK_WAIT_MS = 30 * 1000;
const LOCK_STALE_MS = 2 * LOCK_WAIT_MS;
const POLL_MS = 100;
const processCache = new Map();

function cacheDir() {
  return process.env.CODECEPT_AUTH_CACHE_DIR || path.join(os.tmpdir(), 'hmcts-codecept-auth-cache');
}

function ttlMs() {
  return Number(process.env.CODECEPT_AUTH_CACHE_TTL_MS || DEFAULT_TTL_MS);
}

function cachePath(key) {
  const hash = crypto.createHash('sha256').update(JSON.stringify(key)).digest('hex');
  return path.join(cacheDir(), `${hash}.json`);
}

function logCache(event, filePath) {
  if (process.env.CODECEPT_AUTH_CACHE_DEBUG === 'true') {
    console.log(`[auth-cache] ${event} ${path.basename(filePath)}`);
  }
}

function isFresh(entry, now = Date.now()) {
  return entry && entry.value && entry.expiresAt > now;
}

function readFreshEntry(filePath) {
  try {
    const entry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return isFresh(entry) ? entry : undefined;
  } catch (_error) {
    return undefined;
  }
}

function writeCache(filePath, value, ttl = ttlMs()) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify({
    value,
    expiresAt: Date.now() + ttl
  }), { mode: 0o600 });
  fs.renameSync(tempPath, filePath);
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withLock(filePath, action) {
  const lockPath = `${filePath}.lock`;
  const started = Date.now();
  while (true) {
    try {
      fs.mkdirSync(lockPath, { recursive: false });
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
      let stats;
      try {
        stats = fs.statSync(lockPath);
      } catch (statError) {
        if (statError.code === 'ENOENT') {
          continue;
        }
        throw statError;
      }
      const ageMs = Date.now() - stats.mtimeMs;
      if (ageMs > LOCK_STALE_MS) {
        fs.rmSync(lockPath, { recursive: true, force: true });
        continue;
      }
      if (Date.now() - started > LOCK_WAIT_MS) {
        throw new Error(`Timed out waiting for auth cache lock: ${lockPath}`);
      }
      await wait(POLL_MS);
    }
  }

  try {
    return await action();
  } finally {
    fs.rmSync(lockPath, { recursive: true, force: true });
  }
}

async function getOrCreate(key, createValue) {
  const filePath = cachePath(key);
  const memoryEntry = processCache.get(filePath);
  if (isFresh(memoryEntry)) {
    logCache('hit:memory', filePath);
    return memoryEntry.value;
  }

  const fileEntry = readFreshEntry(filePath);
  if (fileEntry) {
    logCache('hit:file', filePath);
    processCache.set(filePath, { value: fileEntry.value, expiresAt: fileEntry.expiresAt });
    return fileEntry.value;
  }

  return withLock(filePath, async () => {
    const lockedFileEntry = readFreshEntry(filePath);
    if (lockedFileEntry) {
      logCache('hit:file-after-lock', filePath);
      processCache.set(filePath, { value: lockedFileEntry.value, expiresAt: lockedFileEntry.expiresAt });
      return lockedFileEntry.value;
    }

    logCache('miss:create', filePath);
    const value = await createValue();
    if (!value) {
      throw new Error(`Auth cache creator returned no value for ${JSON.stringify(key)}`);
    }
    const ttl = ttlMs();
    writeCache(filePath, value, ttl);
    logCache('stored', filePath);
    processCache.set(filePath, { value, expiresAt: Date.now() + ttl });
    return value;
  });
}

module.exports = {
  getOrCreate,
  _private: { cachePath, lockStaleMs: LOCK_STALE_MS, lockWaitMs: LOCK_WAIT_MS, writeCache }
};
