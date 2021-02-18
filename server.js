/* eslint-disable no-irregular-whitespace */
/* eslint-disable indent */
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');
const express = require('express');
const route = require('./express/app');
const roles = require('./express/infrastructure/roles');
const csurf = require('csurf');
const moment = require('moment');
const healthcheck = require('./express/infrastructure/health-info');
const { Logger } = require('@hmcts/nodejs-logging');
const { ApiCallError, ApiErrorFactory } = require('./express/infrastructure/errors');
const session = require('express-session');
// const { getXuiNodeMiddleware } = require('./express/config/sessionmiddleware');
const config = require('@hmcts/properties-volume').addTo(require('config'));
const redis = require('redis');
const redisStore = require('connect-redis')(session);

const redisClient = redis.createClient();
// const router = express.Router();
const app = express();
app.set('trust proxy', true);

// eslint-disable-next-line no-magic-numbers
const HALF_HOUR = 1000 * 60 * 30;
const IN_PROD = NODE_ENV === 'production';
app.use(session({
  secret: config.secrets.ccpay['paybubble-idam-client-secret'],
  name: 'ccpay-session',
  cookie: {
    maxAge: Number(HALF_HOUR),
    secure: IN_PROD,
    sameSite: true
  },
  store: new redisStore({
    host: config.secrets.ccpay['ccpay-redis-connection-string'],
    port: config.redis.port,
    client: redisClient,
    ttl: config.redis.ttl
    }),
  saveUninitialized: false,
  resave: false
}));

// app.get('/api/session', (req, res) => {
//     // console.log(req.sessionID);
//   req.session['name'] = 'santosh';
//   req.session.test = 42;
//   console.log(req.session.test);
//   console.log(req.session);
//   console.log(req.session['name']);
//   res.end('1');
// });
// const { SESSION_OPTIONS } = require('./express/config/session');
// const { REDIS_OPTIONS } = require('./express/config/redis');
// Logger.getLogger(`PAYBUBBLE:san.js1'} -> error`).info(config.secrets.ccpay['ccpay-redis-connection-string']);
// const client1 = redis.createClient(REDIS_OPTIONS);
// const isDevMode = process.env.NODE_ENV === 'development';

/* eslint-disable no-console  */
/* eslint-disable no-unused-vars  */

// const app = express();
// this.RedisStore = getXuiNodeMiddleware();
// console.log(this.RedisStore);
// app.use(getXuiNodeMiddleware());

// if (!isDevMode) {
//   app.set('trust proxy', 1);
// }

// app.use(
//   session({
//     ...SESSION_OPTIONS,
//     store: new RedisStore({ client: client1 })
//   }));

redisClient.on('connect', (req, res) => {
  console.log(`redis connected ${redisClient.connected}`);
}).on('error', error => {
  console.log(error);
});

let csrfProtection = csurf({ cookie: true });
const errorFactory = ApiErrorFactory('server.js');

if (process.env.NODE_ENV === 'development') {
  csrfProtection = (req, res, next) => {
    next();
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = null;
  if (err instanceof ApiCallError) {
    error = err;
  } else if (err.code === 'EBADCSRFTOKEN') {
    error = errorFactory.createForbiddenError(err);
  } else {
    error = errorFactory.createServerError(err);
  }

  const msg = JSON.stringify({ error: error.toString(), cause: error.remoteError ? error.remoteError.toString() : '' });
  Logger.getLogger(`PAYBUBBLE: ${error.fileName || 'server.js1'} -> error`).info(msg);
  Logger.getLogger(`PAYBUBBLE: ${error.fileName || 'server.js2'} -> error`).info(JSON.stringify(err));
  if (req.xhr) {
    res.status(error.status).send({ error: error.remoteError || error.message });
  } else {
    res.status(error.status);
    res.render('error', {
      title: error.status,
      message: error.detailedMessage,
      msg,
      moment
    });
  }
}


module.exports = (security, appInsights) => {
  const client = appInsights.defaultClient;
  const startTime = Date.now();
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json - REMOVE THIS! https://expressjs.com/en/changelog/4x.html#4.16.0
  app.use(bodyParser.json());
  app.use(cookieParser());

  // use helmet for security
  app.use(helmet());
  app.use(helmet.noCache());
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'express/mvc/views'));

  // enable the dist folder to be accessed statically
  app.use(express.static('dist/ccpay-bubble'));
  app.use('/health', healthcheck);
  app.use('/health/liveness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  app.use('/health/readiness', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));

  app.use('/logout', security.logout());
  app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());

  // allow access origin
  // @TODO - This will only take effect when on "dev" environment, but not on "prod"
  if (process.env.NODE_ENV === 'development') {
    app.use('/api', (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth-Dev, CSRF-Token');
      next();
    });
  }

  // make all routes available via this imported module
  app.use('/api', security.protectWithAnyOf(roles.allRoles, ['/**']), csrfProtection, route(appInsights));

  app.use(security.protectWithAnyOf(roles.allRoles, ['/assets/'], express.static('dist')));

  // fallback to this route (so that Angular will handle all routing)
  app.get('**', security.protectWithAnyOf(roles.allRoles, ['/assets/']), csrfProtection,
    (req, res) => {
      res.render('index', { csrfToken: req.csrfToken() });
    });

  app.use(errorHandler);

  const duration = Date.now() - startTime;

  client.trackEvent({ name: 'my custom event', properties: { customProperty: 'custom property value' } });
  client.trackException({ exception: new Error('handled exceptions can be logged with this method') });
  client.trackMetric({ name: 'custom metric', value: 3 });
  client.trackTrace({ message: 'trace message' });
  client.trackMetric({ name: 'server startup time', value: duration });

  return app;
};

// const url = require('url')


// const redisUrl = url.parse('redis://:@127.0.0.1:6379/0');

// const redisProtocol = redisUrl.protocol.substr(0, redisUrl.protocol.length - 1); // Remove trailing ':'
// const redisUsername = redisUrl.auth.split(':')[0];
// const redisPassword = redisUrl.auth.split(':')[1];
// const redisHost = redisUrl.hostname;
// const redisPort = redisUrl.port;
// const redisDatabase = redisUrl.path.substring(1);
// Create redis client
// const client1 = redis.createClient();
// Configure redis client
// const client1 = redis.createClient(6379, '127.0.0.1');
// const client  = redis.createClient();
// const REDIS_USER_DATA_INDEX = 2;
// client1.select(REDIS_USER_DATA_INDEX);
// const client1 = redis.createClient({
//   host: '127.0.0.1',
//   port: 6379,
//   tls: true
// })
