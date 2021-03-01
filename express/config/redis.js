// // tslint:disable:no-magic-numbers
// const {
//   REDIS_HOST = 'redis://localhost',
//   // eslint-disable-next-line no-magic-numbers
//   REDIS_PORT = 6379
//   // REDIS_PASSWORD = 'secret'
// } = process.env;

// const REDIS_OPTIONS = {
//   port: Number(REDIS_PORT),
//   host: REDIS_HOST,
//   // password: REDIS_PASSWORD,
//   ttl: 260
// };

// module.exports = { REDIS_OPTIONS };
// // const url = require('url');

// // const redisUrl = url.parse('redis://:@127.0.0.1:6379/0');
// // const {
// //   REDIS_HOST = redisUrl.hostname,
// //   REDIS_PORT = redisUrl.port,
// //   REDIS_PASSWORD = redisUrl.auth.split(':')[1],
// //   REDIS_USERNAME = redisUrl.auth.split(':')[0],
// //   REDIS_PROTOCOL = redisUrl.protocol.substr(0, redisUrl.protocol.length - 1)
// // } = process.env;

// // const REDIS_OPTIONS = {
// //   port: +REDIS_PORT,
// //   host: REDIS_HOST,
// //   password: REDIS_PASSWORD,
// //   username: REDIS_USERNAME,
// //   password: REDIS_PROTOCOL,
// //   ttl: 86400,
// //   tls: true
// // };

// // module.exports = { REDIS_OPTIONS };
// const express = require('express');
// const router = express.Router();
// const redis = require("redis");
// const client = redis.createClient({
//   port: 6379,
//   host: 'localhost'
// });

// client.on('connect', function() {
// console.log('client connected to redis'); // Prints multiple time in console
// });

// client.on('ready ', function() {
//   console.log('client connected to redis and ready to use'); // Prints multiple time in console
//   });

// client.on("error", function (err) { console.log("Error " + err);});

// client.on('end', function() {
//   console.log('client disconnected from redis'); // Prints multiple time in console
//   });

// module.exports=client;
/* eslint-disable no-irregular-whitespace */
/* eslint-disable indent */
/*  eslint-disable no-magic-numbers */
/*  eslint-disable no-console */
/*  eslint-disable func-names */
/*  eslint-disable prefer-arrow-callback */
/*  eslint-disable object-shorthand */
const redis = require('redis');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const config = require('@hmcts/properties-volume').addTo(require('config'));
const HALF_HOUR = 1000 * 60 * 30;
const NODE_ENV = 'development';
const IN_PROD = NODE_ENV !== 'development';

// const tlsOptions = {
//   prefix: config.redis.prefix
// }
// console.log( config.secrets.ccpay['ccpay-redis-connection-string']);
// const redisUrl = config.secrets.ccpay['ccpay-redis-connection-string'];
const redisClient = redis.createClient({ port: config.redis.port, host: 'localhost' });

// const redisStore = new RedisStore({
//   client: client,
//   ttl: 60 * 60 * 10
// });
// client.on('connect', () => {
//   // console.log( config.get('secrets.ccpay.ccpay-redis-connection-string'));
//   // console.log( config.redis.host);
//   console.log(`redis connected 1${client.connected}`);
// }).on('error', error => {
//   console.log(error);
// });

// client.on('ready', () => {
//   console.log('redis client is ready');
// });

// function getAllActiveSessions() {
//   return new Promise((resolve, reject) => {
//     redisStore.all(function(err, sessions) {
//       if (err) reject(err);
//         else resolve(sessions);
//       });
//     });
// }

module.exports = session({
  secret: config.secrets.ccpay['paybubble-idam-client-secret'],
  name: 'ccpay-session1',
  cookie: {
      maxAge: Number(HALF_HOUR),
      secure: IN_PROD,
    httpOnly: true,
      sameSite: true
    },
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: true,
  resave: false
});
