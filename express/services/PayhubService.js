const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');
const FeatureService = require('./FeatureService');

const payhubUrl = config.get('payhub.url');
const ccpayBubbleReturnUrl = config.get('ccpaybubble.url');
const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('s2s.key');
const microService = config.get('ccpaybubble.microservice');
const ccdUrl = config.get('ccd.url');
const CASE_REF_VALIDATION_ENABLED = 'caseref-validation';

class PayhubService {
  constructor() {
    this.featureService = new FeatureService();
  }
  async sendToPayhub(req) {
    const serviceAuthToken = await this.createAuthToken();
    return request.post({
      uri: `${payhubUrl}/card-payments`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken}`,
        'return-url': `${ccpayBubbleReturnUrl}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }

  async postPaymentGroupToPayhub(req) {
    const serviceAuthToken = await this.createAuthToken();
    return request.post({
      uri: `${payhubUrl}/payment-groups/${req.params.paymentGroup}/card-payments`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken}`,
        'return-url': `${ccpayBubbleReturnUrl}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }

  postPaymentGroup(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/payment-groups`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  putPaymentGroup(req) {
    return this.createAuthToken().then(token => request.put({
      uri: `${payhubUrl}/payment-groups/${req.params.paymentGroup}`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  postRemission(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/remissions`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  deleteFees(req) {
    return this.createAuthToken().then(token => request.delete({
      uri: `${payhubUrl}/fees/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  postPartialRemission(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/payment-groups/${req.params.paymentGroup}/fees/${req.params.feeId}/remissions`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  postAllocatePayment(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/payment-groups/${req.params.paymentGroup}/bulk-scan-payments`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  postBSPayments(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/payment-groups/bulk-scan-payments`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  postPaymentAllocations(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/payment-allocations`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  getPayment(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${payhubUrl}/payments/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  getPaymentGroup(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${payhubUrl}/payment-groups/${req.params.paymentGroup}`,
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

  ccpayWebComponentIntegration(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${payhubUrl}/${req.params[0]}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  validateCaseReference(req) {
    let serviceToken = '';
    return this.createAuthToken()
      .then(token => {
        serviceToken = token;
        return this.featureService.getFeatures(req, token);
      })
      .then(data => this.isCaseRefValidationEnabled(data))
      .then(isValidationEnabled => {
        if (isValidationEnabled) {
          return request.get({
            uri: `${ccdUrl}/cases/${req.params.caseref.replace(/-/g, '')}`,
            headers: {
              Authorization: `Bearer ${req.authToken}`,
              ServiceAuthorization: `Bearer ${serviceToken}`,
              experimental: 'true',
              accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.case.v2+json;charset=UTF-8',
              'Content-Type': 'application/json'
            },
            json: true
          });
        }
        return 'OK';
      });
  }

  getFees() {
    return request.get({ uri: config.get('fee.feeRegistrationUrl') });
  }

  isCaseRefValidationEnabled(features) {
    const regFeature = features.find(feature => feature.uid === CASE_REF_VALIDATION_ENABLED);
    return regFeature ? regFeature.enable : false;
  }
}

module.exports = PayhubService;
