// eslint-disable-next-line no-magic-numbers
const HALF_HOUR = 1000 * 60 * 30;
const config = require('@hmcts/properties-volume').addTo(require('config'));

const {
  // SESSION_SECRET = 'secret',
  SESSION_NAME = 'santosh',
  SESSION_IDLE_TIMEOUT = HALF_HOUR,
  NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const SESSION_OPTIONS = {
  secret: config.secrets.ccpay['paybubble-idam-client-secret'],
  name: SESSION_NAME,
  cookie: {
    maxAge: Number(SESSION_IDLE_TIMEOUT),
    secure: IN_PROD,
    sameSite: true
  },
  rolling: true,
  resave: true,
  saveUninitialized: true
};

module.exports = { SESSION_OPTIONS };
