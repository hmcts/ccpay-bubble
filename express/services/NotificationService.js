/* eslint-disable no-undefined */
const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');

const notificationUrl = config.get('notification.url');

const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');

class NotificationService {
  getRefundNotification(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${notificationUrl}/notifications/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }
  getaddressByPostcode(req) {
    return this.createAuthToken().then(token => request.get({
      uri: `${notificationUrl}/notifications/postcode-lookup/${req.params.postcode}`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    }));
    /*
    Logger.getLogger('postcode: user').info(postcodeLookupKey);
    return request.get({
      uri: `${postcodeLookupUrl}/postcode?postcode=${req.query.postcode}&KEY=${postcodeLookupKey}`,
      headers: { 'Content-Type': 'application/json' },
      json: true
    });*/
  }
  docPreview(req) {
    /* eslint-disable no-console */
    return this.createAuthToken().then(token => request.post({
      uri: `${notificationUrl}/notifications/doc-preview`,
      body: req.body,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `${token}`,
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

module.exports = NotificationService;
