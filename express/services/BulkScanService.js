const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');

const bulkScanUrl = config.get('bulkscan.url');
const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');

class BulkScanService {
  getPaymentDetailsForDcn(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${bulkScanUrl}/cases?document_control_number=${req.query.document_control_number}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  patchBSChangeStatus(req) {
    return this.createAuthToken().then(token => request.patch({
      uri: `${bulkScanUrl}/bulk-scan-payments/${req.params.id}/status/${req.params[0]}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  getPaymentDetailsForCcd(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${bulkScanUrl}/cases/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  getSelectedReport(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${bulkScanUrl}/report/data?date_from=${req.query.date_from}&date_to=${req.query.date_to}&report_type=${req.query.report_type}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  createAuthToken() {
    const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
    const serviceAuthRequest = {
      microservice: microService,
      oneTimePassword: otpPassword
    };
    return request.post({
      uri: `${s2sUrl}/lease`,
      body: serviceAuthRequest,
      json: true
    });
  }
}

module.exports = BulkScanService;
