const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');

const refundsUrl = config.get('refunds.url');
const idamurl = config.get('idam.api_url');
const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');

class RefundsService {
  getRefundReason(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${refundsUrl}/refund/reasons`,
      headers: {
        Authorization: `${req.authToken}`,
        ServiceAuthorization: `${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  postIssueRefund(req) {
    return this.createAuthToken().then(token => request.post({
      uri: `${refundsUrl}/refund`,
      body: req.body,
      headers: {
        Authorization: `${req.authToken}`,
        ServiceAuthorization: `${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }


  getUserDetails(req) {
    Logger.getLogger('Refundservice: enter').info(req);
    Logger.getLogger('Refundservice1: enter').info(req.cookies('__auth-token'));
    Logger.getLogger('Refundservice2: enter').info(req.header('Auth-Dev'));
    Logger.getLogger('Refundservice3').info('About to call user details endpoint');
    return this.createAuthToken().then(() => request.get({
      uri: `${idamurl}/details`,
      headers: {
        Authorization: `Bearer ${req.cookies('__auth-token')}`,
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

module.exports = RefundsService;
