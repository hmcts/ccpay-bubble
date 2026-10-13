/* eslint-disable max-lines */
'use strict';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const request = require('superagent');
const URL = require('url');
const { v4: UUID } = require('uuid');
const { ApiErrorFactory } = require('./errors');
const { Logger } = require('@hmcts/nodejs-logging');

const errorFactory = ApiErrorFactory('security.js');

const constants = Object.freeze({
  SECURITY_COOKIE: '__auth-token',
  REDIRECT_COOKIE: '__redirect',
  USER_COOKIE: '__user-info',
  CSRF_TOKEN: '_csrf',
  PCIPAL_SECURITY_INFO: '__pcipal-info'
});

const ACCESS_TOKEN_OAUTH2 = 'access_token';

/* The redirect cookie and any session-held states only need to survive an IdAM
 * round trip. Bounding them stops a stale login outliving the flow. */
const REDIRECT_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
const MAX_OUTSTANDING_STATES = 10;

function Security(options) {
  this.opts = options || {};

  if (!this.opts.loginUrl) {
    throw new Error('login URL required for Security');
  }
}

/* --- INTERNAL --- */

function addOAuth2Parameters(url, state, self, req) {
  let redirectUri = `https://${req.get('host')}${self.opts.redirectUri}`;
  if (process.env.NODE_ENV === 'development') {
    redirectUri = `http://${req.get('host')}${self.opts.redirectUri}`;
  }
  Logger.getLogger(`CCPAY-BUBBLE: security.js`).info(`idAM redirect_uri: ${redirectUri}`);
  url.query.response_type = 'code';
  url.query.state = state;
  url.query.client_id = self.opts.clientId;
  url.query.scope = 'openid profile roles search-user';
  url.query.redirect_uri = redirectUri;
}

function generateState() {
  return UUID();
}

function storeRedirectCookie(req, res, continueUrl, state) {
  const url = URL.parse(continueUrl);
  const cookieValue = { continue_url: url.path, state };
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: REDIRECT_COOKIE_MAX_AGE_MS
  };
  if (req.protocol === 'https') {
    cookieOptions.secure = true;
  }
  res.cookie(constants.REDIRECT_COOKIE, JSON.stringify(cookieValue), cookieOptions);
  rememberState(req, url.path, state);
}

/* Keeps every outstanding state in the session, not just the latest. The cookie
 * is a single slot, so concurrent or repeated logins would otherwise clobber
 * each other and fail the callback with "redirect cookie is missing". */
function rememberState(req, continueUrl, state) {
  if (!req.session) {
    return;
  }
  const states = Array.isArray(req.session.oauthStates) ? req.session.oauthStates : [];
  states.push({ state, continueUrl, issuedAt: Date.now() });
  req.session.oauthStates = states.slice(-MAX_OUTSTANDING_STATES);
}

/* Returns and removes the outstanding state matching the one IdAM echoed back. */
function consumeMatchedState(req, state) {
  if (!req.session || !Array.isArray(req.session.oauthStates) || !state) {
    return null;
  }
  const index = req.session.oauthStates.findIndex(entry => entry.state === state);
  if (index === -1) {
    return null;
  }
  return req.session.oauthStates.splice(index, 1)[0];
}

function login(req, res, roles, self) {
  const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const state = generateState();

  storeRedirectCookie(req, res, originalUrl, state);

  let url = null;

  if (roles.includes('letter-holder')) {
    url = URL.parse(`${self.opts.loginUrl}/pin`, true);
  } else {
    url = URL.parse(self.opts.loginUrl, true);
  }

  addOAuth2Parameters(url, state, self, req);

  res.redirect(url.format());
}

function authorize(req, res, next, self) {
  if (req.roles !== null) {
    for (const role in self.roles) {
      if (req.roles.includes(self.roles[role])) {
        res.cookie(constants.USER_COOKIE, JSON.stringify(req.userInfo), {secure: true});
        return next();
      }
    }
  }
  const error = errorFactory.createForbiddenError(null, `ERROR: Access forbidden - User does not have any of ${self.roles}. Actual roles:${req.roles}`);
  return next(error);
}

function getTokenFromCode(self, req) {
  const url = URL.parse(`${self.opts.apiUrl}/oauth2/token`, true);
  let redirectUri = `https://${req.get('host')}${self.opts.redirectUri}`;
  if (process.env.NODE_ENV === 'development') {
    redirectUri = `http://${req.get('host')}${self.opts.redirectUri}`;
  }
  return request.post(url.format())
    .auth(self.opts.clientId, self.opts.clientSecret)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ grant_type: 'authorization_code' })
    .send({ code: req.query.code })
    .send({ redirect_uri: `${redirectUri}` });
}

const USER_DETAILS_TIMEOUT_MS = 10000;
const USER_DETAILS_RETRIES = 2;

function getUserDetails(self, securityCookie) {
  return request.get(`${self.opts.apiUrl}/details`)
    .timeout(USER_DETAILS_TIMEOUT_MS)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}

/* Retries getUserDetails on transient failures (timeout, network or 5xx).
 * Non-retryable errors (e.g. 401/403) and final failures reject with the error. */
function getUserDetailsWithRetry(self, securityCookie, retries = USER_DETAILS_RETRIES) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      getUserDetails(self, securityCookie).end((err, response) => {
        if (!err) {
          return resolve(response);
        }
        const retryable = !err.status || err.status >= 500;
        if (retryable && remaining > 0) {
          return attempt(remaining - 1);
        }
        return reject(err);
      });
    };
    attempt(retries);
  });
}

function storeCookie(req, res, token) {
  req.authToken = token;
  res.cookie(constants.SECURITY_COOKIE, req.authToken, { secure: true, httpOnly: true });
}

function handleCookie(req) {
  if (req.cookies && req.cookies[constants.SECURITY_COOKIE]) {
    req.authToken = req.cookies[constants.SECURITY_COOKIE];
    return req.authToken;
  }

  return null;
}

function invalidateToken(self, req) {
  const url = URL.parse(`${self.opts.apiUrl}/session/${req.cookies[constants.SECURITY_COOKIE]}`, true);
  return request.delete(url.format())
    .auth(self.opts.clientId, self.opts.clientSecret);
}
Security.prototype.pcipalForm = function pcipalForm(req, res) {
  const pcipalData = req.cookies[constants.PCIPAL_SECURITY_INFO];
  let html = '';
  html += '<body>';
  html += `<form action='${pcipalData.url}' enctype='application/x-www-form-urlencoded; charset=utf-8' method='post' name='form1'>`;
  html += `<input type='hidden' name='X-BEARER-TOKEN' value='${pcipalData.auth}'>`;
  html += `<input type='hidden' name='X-REFRESH-TOKEN' value='${pcipalData.ref}'>`;
  html += 'Loading...';
  html += '</form>';
  html += '<script>window.onload = function () { document.forms["form1"].submit();}</script>';
  html += '</body>';
  res.clearCookie(constants.PCIPAL_SECURITY_INFO);
  return html;
};

Security.prototype.logout = function logout() {
  const self = { opts: this.opts };

  return function ret(req, res) {
    /* Best-effort server-side token invalidation. Kept non-blocking and bounded
     * so a hanging IDAM call can never prevent the logout redirect. */
    if (req.cookies && req.cookies[constants.SECURITY_COOKIE]) {
      invalidateToken(self, req).timeout(5000).end(() => {});
    }

    res.clearCookie(constants.SECURITY_COOKIE);
    res.clearCookie(constants.REDIRECT_COOKIE);
    res.clearCookie(constants.USER_COOKIE);
    res.clearCookie(constants.PCIPAL_SECURITY_INFO);
    res.clearCookie('connect.sid');

    const redirectToIdamLogout = () => {
      /* Single sign-out: redirect the browser to IDAM's OIDC end-session endpoint
       * so the shared SSO session is ended. Without this, IDAM silently
       * re-authenticates the user and the logout never appears to complete. */
      const parsedLoginUrl = URL.parse(self.opts.loginUrl);
      const idamWebOrigin = `${parsedLoginUrl.protocol}//${parsedLoginUrl.host}`;
      const logoutUrl = URL.parse(`${idamWebOrigin}/o/endSession`, true);

      let postLogoutRedirectUri = `https://${req.get('host')}/`;
      if (process.env.NODE_ENV === 'development') {
        postLogoutRedirectUri = `http://${req.get('host')}/`;
      }
      logoutUrl.query.post_logout_redirect_uri = postLogoutRedirectUri;

      return res.redirect(logoutUrl.format());
    };

    if (req.session) {
      req.session.destroy(redirectToIdamLogout);
    } else {
      redirectToIdamLogout();
    }
  };
};

function protectImpl(req, res, next, self) {
  if (self.exceptUrls) {
    for (let i = 0; i < self.exceptUrls.length; i++) {
      if (req.url.includes(self.exceptUrls[i])) {
        return next();
      }
    }
  }
  let securityCookie = null;
  securityCookie = handleCookie(req);

  if (!securityCookie) {
    return login(req, res, self.roles, self);
  }

  Logger.getLogger('PAYBUBBLE: server.js').info('About to call user details endpoint');
  return getUserDetailsWithRetry(self, securityCookie).then(
    (response) => {
      Logger.getLogger('CCPAY-BUBBLE: security.js').info('Welcome pay bubble');
      self.opts.appInsights.setAuthenticatedUserContext(response.body.email);
      req.roles = response.body.roles;
      req.userInfo = response.body;
      return authorize(req, res, next, self);
    },
    (err) => {
      Logger.getLogger('PAYBUBBLE: server.js -> error').info(`Get user details called with the result: err: ${err}`);
      if (!err.status) {
        err.status = 500;
      }

      switch (err.status) {
      case UNAUTHORIZED:
        return login(req, res, self.roles, self);
      case FORBIDDEN:
        return next(errorFactory.createForbiddenError(err, 'getUserDetails() call was forbidden'));
      default:
        return next(errorFactory.createServerError(err, 'getUserDetails() call failed'));
      }
    });
}

Security.prototype.protect = function protect(role, exceptUrls) {
  const self = {
    roles: [role],
    new: false,
    opts: this.opts,
    exceptUrls
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithAnyOf = function protectWithAnyOf(roles, exceptUrls) {
  const self = {
    roles,
    new: false,
    opts: this.opts,
    exceptUrls
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithUplift = function protectWithUplift(role, roleToUplift) {
  const self = {
    role,
    roleToUplift,
    new: false,
    opts: this.opts
  };

  return function ret(req, res, next) {
    /* Read the value of the token from the cookie */
    const securityCookie = handleCookie(req);

    if (!securityCookie) {
      return login(req, res, self.role, self);
    }

    return getUserDetailsWithRetry(self, securityCookie).then(
      (response) => {
        req.roles = response.body.roles;
        req.userInfo = response.body;

        if (req.roles.includes(self.role)) { /* LOGGED IN ALREADY WITH THE UPLIFTED USER */
          return next();
        }

        if (!req.roles.includes(self.roleToUplift)) {
          return next(errorFactory.createUnatohorizedError(null, 'This user can not uplift'));
        }

        /* REDIRECT TO UPLIFT PAGE */
        const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        const state = generateState();
        storeRedirectCookie(req, res, originalUrl, state);

        const url = URL.parse(`${self.opts.loginUrl}/uplift`, true);
        addOAuth2Parameters(url, state, self, req);
        url.query.jwt = securityCookie;

        return res.redirect(url.format());
      },
      (err) => {
        /* If the token is expired we want to go to login.
        * - This invalidates correctly sessions of letter users that does not exist anymore
        */
        if (err.status === UNAUTHORIZED) {
          return login(req, res, [], self);
        }
        return next(errorFactory.createUnatohorizedError(err, `getUserDetails() call failed: ${err.message}`));
      });
  };
};

function getRedirectCookie(req) {
  const rawCookie = req.cookies && req.cookies[constants.REDIRECT_COOKIE];

  if (!rawCookie) {
    return null;
  }

  try {
    return JSON.parse(rawCookie);
  } catch (error) {
    Logger.getLogger('CCPAY-BUBBLE: security.js').warn(`Ignoring malformed ${constants.REDIRECT_COOKIE} cookie`);
    return null;
  }
}

/* Callback endpoint */
Security.prototype.OAuth2CallbackEndpoint = function OAuth2CallbackEndpoint() {
  const self = { opts: this.opts };

  return function ret(req, res, next) {
    const logger = Logger.getLogger('CCPAY-BUBBLE: security.js');
    const receivedState = req.query.state;
    const hasCode = Boolean(req.query.code);

    /* We check that our stored state matches the requested one. The cookie is the
     * primary record; the session keeps every outstanding state so a repeated or
     * concurrent login cannot consume the single cookie slot and dead-end here. */
    const redirectInfo = getRedirectCookie(req);
    let continueUrl = null;

    if (redirectInfo) {
      if (redirectInfo.state !== receivedState) {
        return next(errorFactory.createUnatohorizedError(null, `States do not match: ${redirectInfo.state} is not ${receivedState}`));
      }

      if (!String(redirectInfo.continue_url || '').startsWith('/')) {
        return next(errorFactory.createUnatohorizedError(null, `Invalid redirect_uri: ${redirectInfo.continue_url}`));
      }

      continueUrl = redirectInfo.continue_url;
    } else {
      const matchedState = consumeMatchedState(req, receivedState);

      if (matchedState) {
        logger.warn(`Redirect cookie missing but state matched an outstanding session state; recovering to ${matchedState.continueUrl}`);
        continueUrl = matchedState.continueUrl;
      } else if (hasCode) {
        /* The redirect cookie is gone (dropped by the browser, or a retry that
         * skipped login()) but IdAM returned a code. Recover instead of bouncing
         * the user to a dead-end 401 - the code is still redeemed below. */
        logger.warn(`Redirect cookie missing with a code present for state ${receivedState}; recovering to /`);
        continueUrl = '/';
      } else {
        return next(errorFactory.createUnatohorizedError(null, 'Redirect cookie is missing'));
      }
    }

    if (!hasCode) {
      return res.redirect(continueUrl);
    }

    return getTokenFromCode(self, req).end((err, response) => { /* We ask for the token */
      if (err) {
        return next(errorFactory.createUnatohorizedError(err, 'getTokenFromCode call failed'));
      }

      /* Only clear the previous session now that we hold a token, so a stray or
       * duplicated callback can no longer log a working user out. */
      res.clearCookie(constants.SECURITY_COOKIE);
      res.clearCookie(constants.USER_COOKIE);

      /* We store it in a session cookie */
      storeCookie(req, res, response.body[ACCESS_TOKEN_OAUTH2]);

      /* We delete redirect cookie */
      res.clearCookie(constants.REDIRECT_COOKIE);

      /* We initialise appinsight with user details */
      getUserDetails(self, req.authToken).end(
        (error, resp) => {
          if (!error) {
            const userInfo = resp.body;
            self.opts.appInsights.setAuthenticatedUserContext(userInfo.email);
            if (self.opts.appInsights.defaultClient) {
              self.opts.appInsights.defaultClient.trackEvent({ name: 'login_event', properties: { role: userInfo.roles } });
            }
          }
        }
      );

      /* And we redirect back to where we originally tried to access */
      return res.redirect(continueUrl);
    });
  };
};

module.exports = {
  Security,
  constants
};
