const healthcheck = require('@hmcts/nodejs-healthcheck');
const express = require('express')
const config = require('config')

const router = express.Router()
const healthCheckConfig = {
  checks: {
    'payhub': basicHealthCheck('payhub.url'),
    'idamapi': basicHealthCheck('idam.api_url'),
    'idamauthenticationweb': basicHealthCheck('idam.login_url')
  }
}
function basicHealthCheck(serviceName) {
  return healthcheck.web(url(serviceName))
}

function url(serviceName) {
  const healthCheckUrlLocation = `${serviceName}.healthCheckUrl`

  if (config.has(healthCheckUrlLocation)) {
    return config.get(healthCheckUrlLocation)
  } else {
    return config.get(`${serviceName}`) + '/health'
  }
}

router.get('/', healthcheck.addTo(router, healthCheckConfig));

module.exports = router;
