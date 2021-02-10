// import { RedisOptions } from 'ioredis';
// tslint:disable:no-magic-numbers
const {
  REDIS_HOST = 'localhost',
  // eslint-disable-next-line no-magic-numbers
  REDIS_PORT = 6379,
  REDIS_PASSWORD = 'secret'
} = process.env;

const REDIS_OPTIONS = {
  port: Number(REDIS_PORT),
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  ttl: 86400,
  tls: true
};

module.exports = { REDIS_OPTIONS };
// const url = require('url');
// const redisUrl = url.parse('redis://:@127.0.0.1:6379/0');
// const  {
// REDIS_HOST = redisUrl.hostname,
// REDIS_PORT = redisUrl.port,
// REDIS_PASSWORD = redisUrl.auth.split(':')[1],
// REDIS_USERNAME = redisUrl.auth.split(':')[0],
// REDIS_PROTOCOL = redisUrl.protocol.substr(0, redisUrl.protocol.length - 1) // Remove trailing ':'
// } = process.env

// const REDIS_OPTIONS = {
//     port: +REDIS_PORT,
//     host: REDIS_HOST,
//     password: REDIS_PASSWORD,
//     username: REDIS_USERNAME,
//     password: REDIS_PROTOCOL,
//     ttl: 86400
// }


// module.exports  = { REDIS_OPTIONS };
