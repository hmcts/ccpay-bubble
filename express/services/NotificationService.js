/* eslint-disable no-undefined */
const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');
const { Logger } = require('@hmcts/nodejs-logging');

const notificationUrl = config.get('notification.url');
const ccdurl = config.get('ccd.url');

const postcodeLookupUrl = config.get('postcodelookup.url');
const postcodeLookupKey = config.get('postcodelookup.key');

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
    Logger.getLogger('key').info(postcodeLookupKey);
    Logger.getLogger('url').info(postcodeLookupUrl);
    Logger.getLogger('ccdurl').info(ccdurl);


    return request.get({
      uri: `${postcodeLookupUrl}/postcode?postcode=${req.query.postcode}&KEY=${postcodeLookupKey}`,
      headers: { 'Content-Type': 'application/json' },
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
