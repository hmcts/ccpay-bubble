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
    return request.get({
      uri: 'https://api.os.uk/search/places/v1',
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
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