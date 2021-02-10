const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');
const express = require('express');
const route = require('./express/app');
const roles = require('./express/infrastructure/roles');
const csurf = require('csurf');
const moment = require('moment');
const healthcheck = require('./express/infrastructure/health-info');
const { Logger } = require('@hmcts/nodejs-logging');
const { ApiCallError, ApiErrorFactory } = require('./express/infrastructure/errors');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { SESSION_OPTIONS } = require('./express/config/session');
const { REDIS_OPTIONS } = require('./express/config/redis');
// const client =  redis.createClient(RedisOptions);
/* eslint-disable no-console  */
/* eslint-disable no-unused-vars  */

const client1 = redis.createClient({ REDIS_OPTIONS });
const app = express();

app.use(
  session({
    ...SESSION_OPTIONS,
    store: new RedisStore(client1)
  }));

const errorFactory = ApiErrorFactory('server.js');
let csrfProtection = csurf({ cookie: true });

client1.on('connect', (req, res) => {
  console.log('redis connected1');
  client1.SET('name', 'santosh');
  console.log(`connected ${client1.connected}`);
}).on('error', error => {
  console.log(error);
});

client1.GET('name', (err, val) => {
  if (err) console.log(err.message);
  console.log(val);
});


if (process.env.NODE_ENV === 'development') {
  csrfProtection = (req, res, next) => {
    req.session.env = process.env.NODE_ENV;
    next();
  };
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

  app.use('/logout', security.logout());
  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use('/health/liveness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health/readiness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health', healthcheck);

  // allow access origin
  // @TODO - This will only take effect when on "dev" environment, but not on "prod"
  if (process.env.NODE_ENV === 'development') {
    app.use('/api', (req, res, next) => {
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
      req.session.mm = 'mm';
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

// const url = require('url')


// const redisUrl = url.parse('redis://:@127.0.0.1:6379/0');

// const redisProtocol = redisUrl.protocol.substr(0, redisUrl.protocol.length - 1); // Remove trailing ':'
// const redisUsername = redisUrl.auth.split(':')[0];
// const redisPassword = redisUrl.auth.split(':')[1];
// const redisHost = redisUrl.hostname;
// const redisPort = redisUrl.port;
// const redisDatabase = redisUrl.path.substring(1);
// Create redis client
// const client1 = redis.createClient();
// Configure redis client
// const client1 = redis.createClient(6379, '127.0.0.1');
// const client  = redis.createClient();
// const REDIS_USER_DATA_INDEX = 2;
// client1.select(REDIS_USER_DATA_INDEX);
// const client1 = redis.createClient({
//   host: '127.0.0.1',
//   port: 6379,
//   tls: true
// })
