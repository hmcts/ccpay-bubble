const express = require('express');
const controllers = require('./mvc/controller');
const config = require('config');
const HttpStatus = require('http-status-codes');
const request = require('request-promise-native');

module.exports = appInsights => express.Router()

  .post('/send-to-payhub', (req, res) => {

    request({ uri: 'https://ip3cloud.com/clients/hmcts/payments/index.php?ppAccountID=1210&orderAmount=55000&orderReference=RC-1554-7239-1664-7600&callbackURL=https%3A%2F%2Fcore-api-mgmt-demo.azure-api.net%2Ftelephony-api%2Ftelephony%2Fcallback&customData2=1111-2222-3333-4444' },
      (error, response, body) => {
        return res.status(200).send(body);
      });


    controllers.payhubController.sendToPayhub(req, res, appInsights);
  })

  .post('/remission', (req, res) => {
    controllers.payhubController.postRemission(req, res, appInsights);
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
