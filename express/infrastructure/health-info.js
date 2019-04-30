const healthcheck = require('@hmcts/nodejs-healthcheck');
const express = require('express');
const config = require('config');

const router = express.Router();

function url(serviceName) {
  const healthCheckUrlLocation = `${serviceName}.healthCheckUrl`;

  if (config.has(healthCheckUrlLocation)) {
    return config.get(healthCheckUrlLocation);
  }
  return `${config.get(`${serviceName}`)}/health`;
}

function basicHealthCheck(serviceName) {
  return healthcheck.web(url(serviceName));
}

const healthCheckConfig = {
  checks: {
    payhub: basicHealthCheck('payhub.url'),
    idamapi: basicHealthCheck('idam.api_url')
    // idamauthenticationweb: basicHealthCheck('idam.login_url')
  }
};

router.get('/', healthcheck.configure(healthCheckConfig));

module.exports = router;
