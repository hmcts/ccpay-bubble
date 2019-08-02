const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');

const payhubUrl = config.get('payhub.url');
const ccpayBubbleReturnUrl = config.get('ccpaybubble.url');
const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('s2s.key');
const microService = config.get('ccpaybubble.microservice');

class PayhubService {
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

  getFees() {
    return request.get({ uri: 'https://fees-register-api.platform.hmcts.net/fees-register/fees' });
  }
}

module.exports = PayhubService;
