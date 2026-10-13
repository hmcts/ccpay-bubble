const assert = require('assert');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const request = require('supertest');
const superagent = require('superagent');

const { Security, constants } = require('./security');

const originalPost = superagent.post;
const originalGet = superagent.get;

let postResult = { res: { body: { access_token: 'test-token' } } };
let getResult = { res: { body: { email: 'user@example.com', roles: ['payments'] } } };
let postCallCount = 0;

function chainable(result) {
  const chain = {};
  ['auth', 'set', 'type', 'timeout', 'send'].forEach((method) => {
    chain[method] = () => chain;
  });
  chain.end = (callback) => {
    setImmediate(() => callback(result.err, result.res));
    return chain;
  };
  return chain;
}

function buildSecurity() {
  return new Security({
    loginUrl: 'https://idam.example.com/login',
    apiUrl: 'https://idam-api.example.com',
    clientId: 'paybubble',
    clientSecret: 'client-secret',
    redirectUri: '/oauth2/callback',
    appInsights: {
      setAuthenticatedUserContext: () => {},
      defaultClient: null
    }
  });
}

function buildApp() {
  const security = buildSecurity();
  const app = express();
  app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
  app.use(cookieParser());
  app.get('/protected', security.protectWithAnyOf(['payments'], []), (req, res) => res.send('ok'));
  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ title: err.title, detailedMessage: err.detailedMessage, message: err.message });
  });
  return app;
}

const redirectCookie = (value) => `${constants.REDIRECT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}`;

describe('OAuth2CallbackEndpoint', () => {
  beforeEach(() => {
    postCallCount = 0;
    superagent.post = () => {
      postCallCount += 1;
      return chainable(postResult);
    };
    superagent.get = () => chainable(getResult);
  });

  after(() => {
    superagent.post = originalPost;
    superagent.get = originalGet;
  });

  it('returns 401 when the redirect cookie is missing and there is no code', async () => {
    const response = await request(buildApp()).get('/oauth2/callback?state=orphan-state');

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
  });

  it('rejects a code-only callback with no redirect cookie and no session state (login CSRF)', async () => {
    const response = await request(buildApp()).get('/oauth2/callback?code=attacker-code&state=forged-state');

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.title, '401 - Access Denied');
    assert.strictEqual(postCallCount, 0, 'must not redeem a code without a validated state');
  });

  it('redirects to the stored continue_url when the cookie and state match', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=known-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'known-state' }));

    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.location, '/ccd-search');
  });

  it('returns 401 when the cookie is present but the state does not match', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=received-state')
      .set('Cookie', redirectCookie({ continue_url: '/ccd-search', state: 'different-state' }));

    assert.strictEqual(response.status, 401);
    assert.strictEqual(postCallCount, 0);
  });

  it('does not log out a working session when a callback fails', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=received-state')
      .set('Cookie', [redirectCookie({ continue_url: '/ccd-search', state: 'different-state' }), `${constants.SECURITY_COOKIE}=existing-token`]);

    assert.strictEqual(response.status, 401);
    const setCookie = response.headers['set-cookie'] || [];
    assert.ok(!setCookie.some((cookie) => cookie.startsWith(`${constants.SECURITY_COOKIE}=`)),
      'a failed callback must not clear the existing auth token');
  });

  it('treats a malformed redirect cookie as missing and rejects without a session match', async () => {
    const response = await request(buildApp())
      .get('/oauth2/callback?code=valid-code&state=any-state')
      .set('Cookie', `${constants.REDIRECT_COOKIE}=not-json`);

    assert.strictEqual(response.status, 401);
    assert.strictEqual(postCallCount, 0);
  });

  it('allows a repeated callback for the same state to succeed via the session', async () => {
    const agent = request.agent(buildApp());

    const loginResponse = await agent.get('/protected');
    assert.strictEqual(loginResponse.status, 302);
    const state = new URL(loginResponse.headers.location).searchParams.get('state');
    assert.ok(state, 'login should issue a state');

    const first = await agent.get(`/oauth2/callback?code=first-code&state=${state}`);
    assert.strictEqual(first.status, 302);
    assert.strictEqual(first.headers.location, '/protected');

    const second = await agent.get(`/oauth2/callback?code=second-code&state=${state}`);
    assert.strictEqual(second.status, 302);
    assert.strictEqual(second.headers.location, '/protected');
  });
});
