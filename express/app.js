const express = require('express');
const controllers = require('./mvc/controller');
const config = require('config');
const HttpStatus = require('http-status-codes');

module.exports = appInsights => express.Router()

  .post('/send-to-payhub-url', (req, res) => {
    controllers.payhubController.sendToPayhubWithUrl(req, res, appInsights);
  })

  .post('/send-to-payhub', (req, res) => {
    controllers.payhubController.sendToPayhub(req, res, appInsights);
  })

  .post('/payment-history/send-to-payhub', (req, res) => {
    controllers.payhubController.sendToPayhub(req, res, appInsights);
  })

  .post('/card-payments', (req, res) => {
    controllers.payhubController.postCardPayment(req, res, appInsights);
  })

  .post('/remission', (req, res) => {
    controllers.payhubController.postRemission(req, res, appInsights);
  })

  .post('/payment-groups/:paymentGroup/fees/:feeId/remissions', (req, res) => {
    controllers.payhubController.postPartialRemission(req, res, appInsights);
  })

  .get('/payment-groups/:paymentGroup', (req, res) => {
    controllers.payhubController.getPaymentGroup(req, res, appInsights);
  })

  .get('/payments/:id', (req, res) => {
    controllers.payhubController.getPayment(req, res);
  })

  .get('/fees-jurisdictions/:id', (req, res) => {
    controllers.feeController.getJurisdictions(req, res);
  })

  .get('/fees', (req, res) => {
    controllers.feeController.getFees(req, res);
  })

  // @hmcts/ccpay-web-component integration point
  .get('/payment-history/*', (req, res) => {
    controllers.payhubController.ccpayWebComponentIntegration(req, res);
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
