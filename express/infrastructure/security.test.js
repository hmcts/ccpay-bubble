const assert = require('assert');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const request = require('supertest');
const superagent = require('superagent');

const { Security, constants } = require('./security');

const originalSuperagent = {
  get: superagent.get,
  post: superagent.post,
  delete: superagent.delete
};

/* A tiny fake for the superagent fluent API. Each HTTP method queues the
 * responses that successive `.end()` calls will receive, and records every
 * chain so tests can assert on the URL, headers and body that were sent. */
const http = {
  get: { responses: [], calls: [] },
  post: { responses: [], calls: [] },
  delete: { responses: [], calls: [] }
};

function buildChain(method, url) {
  const record = {
    method,
    url,
    auth: null,
    type: null,
    sets: [],
    sends: [],
    queries: [],
    timeouts: []
  };

  const chain = {};
  chain.auth = (...args) => { record.auth = args; return chain; };
  chain.set = (...args) => { record.sets.push(args); return chain; };
  chain.type = (...args) => { record.type = args; return chain; };
  chain.timeout = (...args) => { record.timeouts.push(args); return chain; };
  chain.send = (data) => { record.sends.push(data); return chain; };
  chain.query = (data) => { record.queries.push(data); return chain; };
  chain.end = (callback) => {
    http[method].calls.push(record);
    const queued = http[method].responses.length ? http[method].responses.shift() : { body: {} };
    const result = typeof queued === 'function' ? queued(record) : queued;

    setImmediate(() => {
      if (!callback) {
        return;
      }
      if (result.err) {
        return callback(result.err, result.res);
      }
      return callback(null, {
        status: result.status || 200,
        body: result.body || {},
        headers: result.headers || {}
      });
    });

    return chain;
  };

  return chain;
}

function resetHttpMock() {
  ['get', 'post', 'delete'].forEach((method) => {
    http[method].responses = [];
    http[method].calls = [];
  });
}

const mockGet = (result) => http.get.responses.push(result);
const mockPost = (result) => http.post.responses.push(result);
const mockDelete = (result) => http.delete.responses.push(result);

const httpError = (status, message) => {
  const err = new Error(message);
  if (status !== undefined) {
    err.status = status;
  }
  return err;
};

const userDetails = (roles, email = 'user@example.com') => ({ body: { email, roles } });
const tokenResponse = (token = 'test-token') => ({ body: { access_token: token } });

function createSecurity(overrides = {}) {
  return new Security({
    loginUrl: 'https://idam.example.com/login',
    apiUrl: 'https://idam-api.example.com',
    clientId: 'paybubble',
    clientSecret: 'client-secret',
    redirectUri: '/oauth2/callback',
    appInsights: {
      setAuthenticatedUserContext: () => {},
      defaultClient: null
    },
    ...overrides
  });
}

function buildApp(options = {}) {
  const security = options.security || createSecurity();
  const app = express();

  if (options.trustProxy) {
    app.set('trust proxy', true);
  }
  if (options.session !== false) {
    app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
  }
  app.use(cookieParser());

  app.get('/protected', security.protectWithAnyOf(['payments'], []), (req, res) => res.send('ok'));
  app.get('/multi', security.protectWithAnyOf(['payments', 'admin'], []), (req, res) => res.send('ok'));
  app.get('/single', security.protect('payments'), (req, res) => res.send('ok'));
  app.get('/letter', security.protect('letter-holder'), (req, res) => res.send('ok'));
  app.get('/except', security.protectWithAnyOf(['payments'], ['/except']), (req, res) => res.send('ok'));
  app.get('/no-skip', security.protectWithAnyOf(['payments'], ['/assets']), (req, res) => res.send('ok'));
  app.get('/uplift', security.protectWithUplift('payments', 'senior-payments'), (req, res) => res.send('ok'));
  app.get('/pcipal', (req, res) => res.send(security.pcipalForm(req, res)));
  app.get('/logout', security.logout());

  if (options.seedSession) {
    app.get('/seed', (req, res) => {
      req.session.oauthRedirects = req.session.oauthRedirects || {};
      req.session.oauthRedirects['session-state'] = { continue_url: '/recovered', state: 'session-state' };
      res.send('seeded');
    });
  }

  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
      title: err.title,
      detailedMessage: err.detailedMessage,
      message: err.message
    });
  });

  return app;
}

const redirectCookie = (value) => `${constants.REDIRECT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}`;
const authCookie = (token = 'valid-token') => `${constants.SECURITY_COOKIE}=${token}`;
const cookieValue = (name, value) => `${name}=j:${JSON.stringify(value)}`;

before(() => {
  superagent.get = (url) => buildChain('get', url);
  superagent.post = (url) => buildChain('post', url);
  superagent.delete = (url) => buildChain('delete', url);
});

after(() => {
  superagent.get = originalSuperagent.get;
  superagent.post = originalSuperagent.post;
  superagent.delete = originalSuperagent.delete;
});

beforeEach(() => resetHttpMock());

describe('Security constructor', () => {
  it('throws when no loginUrl is supplied', () => {
    assert.throws(() => new Security({}), /login URL required for Security/);
  });

  it('throws when called with no options at all', () => {
    assert.throws(() => new Security(), /login URL required for Security/);
  });

  it('constructs successfully when a loginUrl is supplied', () => {
    assert.doesNotThrow(() => createSecurity());
  });
});

describe('constants', () => {
  it('exposes the expected cookie names', () => {
    assert.strictEqual(constants.SECURITY_COOKIE, '__auth-token');
    assert.strictEqual(constants.REDIRECT_COOKIE, '__redirect');
    assert.strictEqual(constants.USER_COOKIE, '__user-info');
    assert.strictEqual(constants.CSRF_TOKEN, '_csrf');
    assert.strictEqual(constants.PCIPAL_SECURITY_INFO, '__pcipal-info');
  });

  it('is frozen', () => {
    assert.ok(Object.isFrozen(constants));
  });
});

describe('login redirect', () => {
  it('redirects unauthenticated users to IdAM with the OAuth2 parameters', async () => {
    const response = await request(buildApp()).get('/protected');

    assert.strictEqual(response.status, 302);
    const location = new URL(response.headers.location);
    assert.strictEqual(`${location.origin}${location.pathname}`, 'https://idam.example.com/login');
    assert.strictEqual(location.searchParams.get('response_type'), 'code');
    assert.strictEqual(location.searchParams.get('client_id'), 'paybubble');
    assert.strictEqual(location.searchParams.get('scope'), 'openid profile roles search-user');
    assert.ok(location.searchParams.get('state'), 'a state should be issued');
    assert.ok(location.searchParams.get('redirect_uri').endsWith('/oauth2/callback'));
  });

  it('stores a redirect cookie pointing back to the original url', async () => {
    const response = await request(buildApp()).get('/protected');

    const setCookie = response.headers['set-cookie'] || [];
    const redirect = setCookie.find((cookie) => cookie.startsWith(`${constants.REDIRECT_COOKIE}=`));
    assert.ok(redirect, 'a redirect cookie should be set');
    const stored = JSON.parse(decodeURIComponent(redirect.split('=').slice(1).join('=').split(';')[0]));
    assert.strictEqual(stored.continue_url, '/protected');
    assert.ok(stored.state);
  });

  it('uses the /pin login url for the letter-holder role', async () => {
    const response = await request(buildApp()).get('/letter');

    assert.strictEqual(response.status, 302);
    const location = new URL(response.headers.location);
    assert.strictEqual(location.pathname, '/login/pin');
  });

  it('marks the redirect cookie secure when the request is https', async () => {
    const response = await request(buildApp({ trustProxy: true }))
      .get('/protected')
      .set('X-Forwarded-Proto', 'https');

    const setCookie = response.headers['set-cookie'] || [];
    const redirect = setCookie.find((cookie) => cookie.startsWith(`${constants.REDIRECT_COOKIE}=`));
    assert.ok(redirect);
    assert.ok(redirect.includes('Secure'), 'the redirect cookie should be secure over https');
  });

  it('still redirects to IdAM when there is no server-side session', async () => {
    const response = await request(buildApp({ session: false })).get('/protected');

    assert.strictEqual(response.status, 302);
    assert.ok(response.headers.location.startsWith('https://idam.example.com/login'));
  });
});

describe('protect exceptUrls', () => {
  it('skips authentication and does not call IdAM for an excepted url', async () => {
    const response = await request(buildApp()).get('/except');

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.text, 'ok');
    assert.strictEqual(http.get.calls.length, 0);
  });

  it('authenticates when the url does not match any except url', async () => {
    mockGet(userDetails(['payments']));

    const response = await request(buildApp()).get('/no-skip').set('Cookie', authCookie());

    assert.strictEqual(response.status, 200);
    assert.strictEqual(http.get.calls.length, 1);
  });
});

describe('authorize', () => {
  it('grants access and sets the user-info cookie when a required role is present', async () => {
    mockGet(userDetails(['payments']));

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 200);
    const setCookie = response.headers['set-cookie'] || [];
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.USER_COOKIE}=`)));
  });

  it('grants access when any one of the required roles matches', async () => {
    mockGet(userDetails(['admin']));

    const response = await request(buildApp()).get('/multi').set('Cookie', authCookie());

    assert.strictEqual(response.status, 200);
  });

  it('sends the security cookie as a bearer token to the user details endpoint', async () => {
    mockGet(userDetails(['payments']));

    await request(buildApp()).get('/protected').set('Cookie', authCookie('my-token'));

    const call = http.get.calls[0];
    assert.ok(call.url.endsWith('/details'));
    assert.ok(call.sets.some(([name, value]) => name === 'Authorization' && value === 'Bearer my-token'));
  });

  it('returns 403 when the user has none of the required roles', async () => {
    mockGet(userDetails(['other']));

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.title, '403 - Forbidden');
  });

  it('returns 403 when user details do not contain a roles list', async () => {
    mockGet(userDetails(null));

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.title, '403 - Forbidden');
  });
});

describe('protect error handling', () => {
  it('redirects to login when user details returns 401 (without retrying)', async () => {
    mockGet({ err: httpError(401, 'unauthorized') });

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 302);
    assert.ok(response.headers.location.startsWith('https://idam.example.com/login'));
    assert.strictEqual(http.get.calls.length, 1, '401 is not retryable');
  });

  it('returns 403 when user details is forbidden', async () => {
    mockGet({ err: httpError(403, 'forbidden') });

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 403);
    assert.strictEqual(http.get.calls.length, 1, '403 is not retryable');
  });

  it('returns 500 for other IdAM error statuses', async () => {
    mockGet({ err: httpError(400, 'bad request') });

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.title, '500 - Internal Server Error');
  });

  it('treats a network error without a status as a retryable server error', async () => {
    mockGet({ err: httpError(undefined, 'socket hang up') });
    mockGet({ err: httpError(undefined, 'socket hang up') });
    mockGet({ err: httpError(undefined, 'socket hang up') });

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 500);
    assert.strictEqual(http.get.calls.length, 3, 'initial attempt plus two retries');
  });

  it('retries transient 5xx failures and succeeds', async () => {
    mockGet({ err: httpError(503, 'unavailable') });
    mockGet(userDetails(['payments']));

    const response = await request(buildApp()).get('/protected').set('Cookie', authCookie());

    assert.strictEqual(response.status, 200);
    assert.strictEqual(http.get.calls.length, 2);
  });
});

describe('protectWithUplift', () => {
  it('redirects to login when there is no security cookie', async () => {
    const response = await request(buildApp()).get('/uplift');

    assert.strictEqual(response.status, 302);
    assert.ok(response.headers.location.startsWith('https://idam.example.com/login'));
  });

  it('grants access when the user already holds the uplifted role', async () => {
    mockGet(userDetails(['payments']));

    const response = await request(buildApp()).get('/uplift').set('Cookie', authCookie());

    assert.strictEqual(response.status, 200);
  });

  it('returns 401 when the user cannot uplift', async () => {
    mockGet(userDetails(['other']));

    const response = await request(buildApp()).get('/uplift').set('Cookie', authCookie());

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
  });

  it('redirects to the uplift page carrying the jwt when the user is eligible', async () => {
    mockGet(userDetails(['senior-payments']));

    const response = await request(buildApp()).get('/uplift').set('Cookie', authCookie('uplift-token'));

    assert.strictEqual(response.status, 302);
    const location = new URL(response.headers.location);
    assert.strictEqual(location.pathname, '/login/uplift');
    assert.strictEqual(location.searchParams.get('jwt'), 'uplift-token');
  });

  it('redirects to login when the token has expired (401)', async () => {
    mockGet({ err: httpError(401, 'expired') });

    const response = await request(buildApp()).get('/uplift').set('Cookie', authCookie());

    assert.strictEqual(response.status, 302);
    assert.ok(response.headers.location.startsWith('https://idam.example.com/login'));
  });

  it('returns 401 for a non-401 user details failure', async () => {
    mockGet({ err: httpError(500, 'boom') });
    mockGet({ err: httpError(500, 'boom') });
    mockGet({ err: httpError(500, 'boom') });

    const response = await request(buildApp()).get('/uplift').set('Cookie', authCookie());

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
  });
});

describe('pcipalForm', () => {
  it('renders the auto-submitting form with the pcipal tokens and clears the cookie', async () => {
    const pcipal = { url: 'https://pcipal.example.com/pay', auth: 'bearer-123', ref: 'refresh-456' };

    const response = await request(buildApp())
      .get('/pcipal')
      .set('Cookie', cookieValue(constants.PCIPAL_SECURITY_INFO, pcipal));

    assert.strictEqual(response.status, 200);
    assert.ok(response.text.includes("action='https://pcipal.example.com/pay'"));
    assert.ok(response.text.includes("name='X-BEARER-TOKEN' value='bearer-123'"));
    assert.ok(response.text.includes("name='X-REFRESH-TOKEN' value='refresh-456'"));
    assert.ok(response.text.includes('document.forms["form1"].submit()'));

    const setCookie = response.headers['set-cookie'] || [];
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.PCIPAL_SECURITY_INFO}=;`)));
  });
});

describe('logout', () => {
  it('invalidates the token, clears cookies and redirects to the IdAM end-session endpoint', async () => {
    mockDelete({ body: {} });

    const response = await request(buildApp())
      .get('/logout')
      .set('Cookie', authCookie('logout-token'));

    assert.strictEqual(response.status, 302);
    const location = new URL(response.headers.location);
    assert.strictEqual(`${location.origin}${location.pathname}`, 'https://idam.example.com/o/endSession');
    assert.ok(location.searchParams.get('post_logout_redirect_uri').endsWith('/'));
  });

  it('performs a best-effort server-side token invalidation', async () => {
    mockDelete({ body: {} });

    await request(buildApp()).get('/logout').set('Cookie', authCookie('logout-token'));

    assert.strictEqual(http.delete.calls.length, 1);
    assert.ok(http.delete.calls[0].url.includes('/session/logout-token'));
    assert.deepStrictEqual(http.delete.calls[0].auth, ['paybubble', 'client-secret']);
  });

  it('clears every relevant cookie', async () => {
    mockDelete({ body: {} });

    const response = await request(buildApp())
      .get('/logout')
      .set('Cookie', authCookie('logout-token'));

    const setCookie = response.headers['set-cookie'] || [];
    [constants.SECURITY_COOKIE, constants.REDIRECT_COOKIE, constants.USER_COOKIE, constants.PCIPAL_SECURITY_INFO]
      .forEach((name) => {
        assert.ok(setCookie.some((cookie) => cookie.startsWith(`${name}=;`)), `${name} should be cleared`);
      });
  });

  it('does not call IdAM when there is no security cookie', async () => {
    const response = await request(buildApp()).get('/logout');

    assert.strictEqual(response.status, 302);
    assert.strictEqual(http.delete.calls.length, 0);
  });

  it('still redirects when there is no server-side session', async () => {
    const response = await request(buildApp({ session: false })).get('/logout');

    assert.strictEqual(response.status, 302);
    assert.ok(response.headers.location.includes('/o/endSession'));
  });
});

describe('OAuth2CallbackEndpoint', () => {
  it('returns 401 when the redirect cookie is missing and there is no session state', async () => {
    const response = await request(buildApp()).get('/oauth2/callback?state=orphan-state');

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
    assert.strictEqual(response.body.message, 'Redirect cookie is missing');
  });

  it('rejects a code-only callback with no redirect cookie and no session state (login CSRF)', async () => {
    const response = await request(buildApp()).get('/oauth2/callback?code=attacker-code&state=forged-state');

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
    assert.strictEqual(http.post.calls.length, 0, 'must not redeem a code without a validated state');
  });

  it('redirects to the stored continue_url when the cookie and state match', async () => {
    mockPost(tokenResponse());

    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.location, '/ccd-search');
  });

  it('exchanges the code with IdAM and stores the resulting token', async () => {
    mockPost(tokenResponse('exchanged-token'));

    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    const post = http.post.calls[0];
    assert.strictEqual(post.url, 'https://idam-api.example.com/oauth2/token');
    assert.deepStrictEqual(post.auth, ['paybubble', 'client-secret']);
    assert.ok(post.sends.some((body) => body.grant_type === 'authorization_code'));
    assert.ok(post.sends.some((body) => body.code === 'valid-code'));

    const setCookie = response.headers['set-cookie'] || [];
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.SECURITY_COOKIE}=exchanged-token`)));
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.REDIRECT_COOKIE}=;`)));
  });

  it('returns 401 when the cookie is present but the state does not match', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=received-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'different-state' }));

    assert.strictEqual(response.status, 401);
    assert.strictEqual(http.post.calls.length, 0);
  });

  it('returns 401 when the stored continue_url is not root-relative', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: 'https://evil.example.com', state: 'known-state' }));

    assert.strictEqual(response.status, 401);
    assert.ok(response.body.message.includes('Invalid redirect_uri'));
    assert.strictEqual(http.post.calls.length, 0);
  });

  it('redirects back without exchanging a token when no code is supplied', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.location, '/ccd-search');
    assert.strictEqual(http.post.calls.length, 0);
  });

  it('treats a malformed redirect cookie as missing and rejects without a session match', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=any-state')
      .set('Cookie', `${constants.REDIRECT_COOKIE}=not-json`);

    assert.strictEqual(response.status, 401);
    assert.strictEqual(http.post.calls.length, 0);
  });

  it('clears any existing auth and user cookies at the start of the callback', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?state=orphan-state')
      .set('Cookie', [authCookie('existing-token'), `${constants.USER_COOKIE}=existing-user`]);

    assert.strictEqual(response.status, 401);
    const setCookie = response.headers['set-cookie'] || [];
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.SECURITY_COOKIE}=;`)),
      'a failed callback must clear the existing auth token');
    assert.ok(setCookie.some((cookie) => cookie.startsWith(`${constants.USER_COOKIE}=;`)));
  });

  it('returns 401 when the token exchange fails', async () => {
    mockPost({ err: httpError(400, 'bad code') });

    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.message, 'getTokenFromCode call failed');
  });

  it('recovers the redirect from the server-side session when the cookie is lost', async () => {
    mockPost(tokenResponse());
    const agent = request.agent(buildApp({ seedSession: true }));

    await agent.get('/seed');
    const response = await agent.get('/oauth2/callback?code=valid-code&state=session-state');

    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.location, '/recovered');
  });

  it('consumes the session state so a replayed callback can no longer recover it', async () => {
    mockPost(tokenResponse());
    mockPost(tokenResponse());
    const agent = request.agent(buildApp({ seedSession: true }));

    await agent.get('/seed');
    const first = await agent.get('/oauth2/callback?code=first-code&state=session-state');
    assert.strictEqual(first.status, 302);

    const second = await agent.get('/oauth2/callback?code=second-code&state=session-state');
    assert.strictEqual(second.status, 401);
  });

  it('keeps the session state when the token exchange fails so it can be retried', async () => {
    mockPost({ err: httpError(500, 'unavailable') });
    mockPost(tokenResponse('retry-token'));
    const agent = request.agent(buildApp({ seedSession: true }));

    await agent.get('/seed');
    const first = await agent.get('/oauth2/callback?code=first-code&state=session-state');
    assert.strictEqual(first.status, 401);

    const second = await agent.get('/oauth2/callback?code=second-code&state=session-state');
    assert.strictEqual(second.status, 302);
    assert.strictEqual(second.headers.location, '/recovered');
  });

  it('initialises app insights and tracks the login event on a successful callback', async () => {
    const users = [];
    const events = [];
    const security = createSecurity({
      appInsights: {
        setAuthenticatedUserContext: (email) => users.push(email),
        defaultClient: { trackEvent: (event) => events.push(event) }
      }
    });
    mockPost(tokenResponse());
    mockGet(userDetails(['payments'], 'logged-in@example.com'));

    const response = await request(buildApp({ security }))
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(users, ['logged-in@example.com']);
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].name, 'login_event');
    assert.deepStrictEqual(events[0].properties, { role: ['payments'] });
  });

  it('skips app insights when the post-callback user lookup fails', async () => {
    const users = [];
    const security = createSecurity({
      appInsights: {
        setAuthenticatedUserContext: (email) => users.push(email),
        defaultClient: null
      }
    });
    mockPost(tokenResponse());
    mockGet({ err: httpError(500, 'boom') });

    const response = await request(buildApp({ security }))
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(users.length, 0);
  });
});

describe('non-development environment', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('uses an https redirect_uri for the login redirect', async () => {
    process.env.NODE_ENV = 'production';

    const response = await request(buildApp()).get('/protected');

    const location = new URL(response.headers.location);
    assert.ok(location.searchParams.get('redirect_uri').startsWith('https://'));
  });

  it('uses an https post_logout_redirect_uri when logging out', async () => {
    process.env.NODE_ENV = 'production';
    mockDelete({ body: {} });

    const response = await request(buildApp()).get('/logout').set('Cookie', authCookie());

    const location = new URL(response.headers.location);
    assert.ok(location.searchParams.get('post_logout_redirect_uri').startsWith('https://'));
  });

  it('uses an https redirect_uri when exchanging the authorization code', async () => {
    process.env.NODE_ENV = 'production';
    mockPost(tokenResponse());

    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    const post = http.post.calls[0];
    assert.ok(post.sends.some((body) => (body.redirect_uri || '').startsWith('https://')));
  });
});
