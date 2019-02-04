const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const HttpStatus = require('http-status-codes');
const express = require('express');
const route = require('./express/app');

const app = express();


module.exports = appInsights => {
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

  // app.use('/oauth2/callback', security.OAuth2CallbackEndpoint());
  app.use('/health', (req, res) => res.status(HttpStatus.OK).json({ status: 'UP' }));
  // app.use('/', (req, res) => res.render('index'));

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
  app.use('/api', route(appInsights));

  // fallback to this route (so that Angular will handle all routing)
  app.get('**',
    (req, res) => {
      res.render('index');
    });

  const duration = Date.now() - startTime;

  client.trackEvent({ name: 'my custom event', properties: { customProperty: 'custom property value' } });
  client.trackException({ exception: new Error('handled exceptions can be logged with this method') });
  client.trackMetric({ name: 'custom metric', value: 3 });
  client.trackTrace({ message: 'trace message' });
  client.trackMetric({ name: 'server startup time', value: duration });

  return app;
};
