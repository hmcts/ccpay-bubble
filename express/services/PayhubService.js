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
    const authToken = req.authToken;
    return request.post({
      uri: `${payhubUrl}/card-payments`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken}`,
        'return-url': `${ccpayBubbleReturnUrl}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }

  postRemission(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}/remission`,
      body: req.body,
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

module.exports = PayhubService;
