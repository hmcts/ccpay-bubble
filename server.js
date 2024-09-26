const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');
const express = require('express');
const session = require('express-session');
const route = require('./express/app');
const roles = require('./express/infrastructure/roles');
const csurf = require('csurf');
const moment = require('moment');
const healthcheck = require('./express/infrastructure/health-info');
const { Logger } = require('@hmcts/nodejs-logging');
const { ApiCallError, ApiErrorFactory } = require('./express/infrastructure/errors');
const crypto = require('crypto');

const app = express();

app.use(session({
  secret: generateSamePassword(seed, 16),
  resave: false,
  saveUninitialized: true
}));

const errorFactory = ApiErrorFactory('server.js');
let csrfProtection = csurf({ cookie: true, key: 'csrf-token', httpOnly: false, secure: true });


/**
 * Generates a deterministic password based on a seed using the SHA-256 hashing algorithm.
 *
 * This function hashes the provided seed using the SHA-256 algorithm and returns a
 * password of the specified length. The same seed will always generate the same password.
 *
 * @param {string} seed - The seed value used to generate the password. The same seed will always produce the same password.
 * @param {number} [length=12] - The desired length of the generated password. Default is 12 characters.
 * @returns {string} A password consisting of the first `length` characters of the SHA-256 hash.
 **/

function generateSamePassword(seed, length = 12) {
  // Hash the seed using a cryptographic algorithm (e.g., SHA-256)
  const hash = crypto.createHash('sha256').update(seed).digest('hex');

  // Return the first `length` characters of the hash as the password
  return hash.slice(0, length);
}


// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = null;
  if (err instanceof ApiCallError) {
    error = err;
  } else if (err.code === 'EBADCSRFTOKEN') {
    error = errorFactory.createForbiddenError(err);
  } else {
    error = errorFactory.createServerError(err);
  }

  const msg = JSON.stringify({ error: error.toString(), cause: error.remoteError ? error.remoteError.toString() : '' });
  Logger.getLogger(`PAYBUBBLE: ${error.fileName || 'server.js'} -> error`).info(msg);
  Logger.getLogger(`PAYBUBBLE: ${error.fileName || 'server.js'} -> error`).info(JSON.stringify(err));
  if (req.xhr) {
    res.status(error.status).send({ error: error.remoteError || error.message });
  } else {
    res.status(error.status);
    res.render('error', {
      title: error.status,
      message: error.detailedMessage,
      msg,
      moment
    });
  }
}

module.exports = (security, appInsights) => {
  const client = appInsights.defaultClient;
  const startTime = Date.now();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json - REMOVE THIS! https://expressjs.com/en/changelog/4x.html#4.16.0
  app.use(bodyParser.json());
  app.use(cookieParser());

  // use helmet for security
  app.use(helmet());
  app.use(helmet.noCache());
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'express/mvc/views'));

  // enable the dist folder to be accessed statically
  app.use(express.static('dist/ccpay-bubble'));

  app.use('/makePaymentByTelephoneyProvider', (req, res) => {
    res.status(HttpStatus.OK).send(security.pcipalForm(req, res));
  });

  app.use('/logout', security.logout());
  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use('/health/liveness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health/readiness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health', healthcheck);


  // Middleware to serve static assets
  app.use('/public', express.static(path.join(__dirname, '/public')));
  app.use('/assets', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend', 'govuk', 'assets')));
  app.use('/hmcts-assets', express.static(path.join(__dirname, '/node_modules/@hmcts/frontend/assets')));
  app.use('/node_modules/govuk-frontend', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk')));


  // allow access origin
  // @TODO - This will only take effect when on "dev" environment, but not on "prod"
  if (process.env.NODE_ENV === 'development') {
    app.use('/api', (_req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth-Dev, CSRF-Token');
      next();
    });
  }

  // make all routes available via this imported module
  app.use('/api', security.protectWithAnyOf(roles.allRoles, ['/**']), csrfProtection, route(appInsights));

  app.use(security.protectWithAnyOf(roles.allRoles, ['/assets/'], express.static('dist')));

  // fallback to this route (so that Angular will handle all routing)
  app.get('**', security.protectWithAnyOf(roles.allRoles, ['/assets/']), csrfProtection,
    (req, res) => {
      res.render('index', { csrfToken: req.csrfToken() });
    });

  app.use(errorHandler);

  const duration = Date.now() - startTime;

  client.trackEvent({ name: 'my custom event', properties: { customProperty: 'custom property value' } });
  client.trackException({ exception: new Error('handled exceptions can be logged with this method') });
  client.trackMetric({ name: 'custom metric', value: 3 });
  client.trackTrace({ message: 'trace message' });
  client.trackMetric({ name: 'server startup time', value: duration });

  return app;
};
