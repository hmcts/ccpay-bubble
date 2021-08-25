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

  .post('/payment-history/payment-groups/card-payments', (req, res) => {
    controllers.payhubController.postPaymentGroupListToPayHub(req, res, appInsights);
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

  .post('/payment-history/payment-groups/:paymentGroup/telephony-card-payments', (req, res) => {
    controllers.payhubController.postPaymentAntennaToPayHub(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/:paymentGroup/bulk-scan-payments-strategic', (req, res) => {
    controllers.payhubController.postStrategicPayment(req, res, appInsights);
  })

  .post('/payment-history/payment-groups/bulk-scan-payments-strategic', (req, res) => {
    controllers.payhubController.postWoPGStrategicPayment(req, res, appInsights);
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

  .get('/payment-history/bulk-scan-feature', (req, res) => {
    controllers.payhubController.bulkScanToggleFeature(req, res);
  })

  .get('/payment-history/LD-feature?*', (req, res) => {
    controllers.payhubController.getLDFeatures(req, res);
  })

  .get('/payment-history/payment-groups/fee-pay-apportion/:id', (req, res) => {
    controllers.payhubController.getApportionPaymentGroup(req, res);
  })

  .delete('/payment-history/fees/:id', (req, res) => {
    controllers.payhubController.deleteFeesFromPaymentGroup(req, res, appInsights);
  })

  .patch('/payment-history/bulk-scan-payments/:id/status/*', (req, res) => {
    controllers.bulkScanController.patchBSChangeStatus(req, res, appInsights);
  })

  // Bulk scanning services
  .get('/bulk-scan/cases/:id', (req, res) => {
    controllers.bulkScanController.getPaymentDetailsForCcd(req, res);
  })
  .get('/bulk-scan/cases?*', (req, res) => {
    controllers.bulkScanController.getPaymentDetailsForDcn(req, res);
  })
  .get('/bulk-scan/report/data?*', (req, res) => {
    controllers.bulkScanController.getSelectedReport(req, res);
  })
  .get('/payment-history/report/data?*', (req, res) => {
    controllers.payhubController.getSelectedReport(req, res);
  })
  .get('/payment-history/case-payment-orders?*', (req, res) => {
    controllers.payhubController.getPartyDetails(req, res);
  })

  .post('/payment-history/payment-groups/:paymentGroup/fees/:feeId/retro-remission', (req, res) => {
    controllers.payhubController.postPaymentGroupWithRetroRemissions(req, res);
  })

  .post('/payment-history/refund-retro-remission ', (req, res) => {
    controllers.payhubController.postRefundRetroRemission(req, res);
  })

  // refund services
  .get('/refund/reasons', (req, res) => {
    controllers.refundController.getRefundReason(req, res);
  })
  .get('/refund/:id/actions', (req, res) => {
    controllers.refundController.getRefundAction(req, res);
  })
  .get('/refund/rejection-reasons', (req, res) => {
    controllers.refundController.getRefundRejectReason(req, res);
  })
  .patch('/refund/:id/action/*', (req, res) => {
    controllers.refundController.patchRefundAction(req, res);
  })
  .get('/refund/get-refund-list', (req, res) => {
    controllers.refundController.getRefundList(req, res);
  })

  .post('/refund/refund', (req, res) => {
    controllers.refundController.postIssueRefund(req, res);
  })

  .post('/refund/get-user-details', (req, res) => {
    controllers.refundController.getUserDetails(req, res);
  })

  .post('/payment-history/refund-for-payment', (req, res) => {
    controllers.payhubController.postRefundsReason(req, res);
  })

  .post('/payment-history/refund-retro-remisstion', (req, res) => {
    controllers.payhubController.postRefundRetroRemission(req, res);
  })

  // @hmcts/ccpay-web-component integration point
  .get('/payment-history/*', (req, res) => {
    controllers.payhubController.ccpayWebComponentIntegration(req, res);
  })
  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('secrets.ccpay.AppInsightsInstrumentationKey') }))

  .get('/cases/:caseref', (req, res) => controllers.payhubController.validateCaseReference(req, res));