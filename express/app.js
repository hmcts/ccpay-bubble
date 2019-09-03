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

  .post('/payment-groups', (req, res) => {
    controllers.payhubController.postPaymentGroup(req, res, appInsights);
  })

  .put('/payment-groups/:paymentGroup', (req, res) => {
    controllers.payhubController.putPaymentGroup(req, res, appInsights);
  })

  .post('/remission', (req, res) => {
    controllers.payhubController.postRemission(req, res, appInsights);
  })

  .post('/payment-groups/:paymentGroup/fees/:feeId/remissions', (req, res) => {
    controllers.payhubController.postPartialRemission(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/:paymentGroup/fees/:feeId/remissions', (req, res) => {
    controllers.payhubController.postPartialRemission(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/:paymentGroup/card-payments', (req, res) => {
    controllers.payhubController.postPaymentGroupToPayHub(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/:paymentGroup/bulk-scan-payments', (req, res) => {
    controllers.payhubController.postAllocatePayment(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/bulk-scan-payments', (req, res) => {
    controllers.payhubController.postBSPayments(req, res, appInsights);
  })

  .post('/payment-history/payment-allocations', (req, res) => {
    controllers.payhubController.postPaymentAllocations(req, res, appInsights);
  })

  .get('/payment-history/payment-groups/:paymentGroup', (req, res) => {
    controllers.payhubController.getPaymentGroup(req, res, appInsights);
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

  .delete('/payment-history/fees/:id', (req, res) => {
    controllers.payhubController.deleteFeesFromPaymentGroup(req, res, appInsights);
  })

  // @hmcts/ccpay-web-component integration point
  .get('/payment-history/*', (req, res) => {
    controllers.payhubController.ccpayWebComponentIntegration(req, res);
  })

  // Bulk scanning services
  .get('/bulk-scan/cases/:id', (req, res) => {
    controllers.bulkScanController.getPaymentDetailsForCcd(req, res);
  })
  .get('/bulk-scan/cases?*', (req, res) => {
    controllers.bulkScanController.getPaymentDetailsForDcn(req, res);
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
