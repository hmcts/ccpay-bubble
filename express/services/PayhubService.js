const config = require('config');
const otp = require('otp');

// const payhubUrl = config.get('payhub.url');
// const returnUrl = config.get('ccpaybubble.url');
const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('s2s.key');
const microService = config.get('ccpaybubble.microservice');

class PayhubService {
  /**
  * Creates an instance of PayhubService.
  * @param {*} makeHttpRequest
  * @memberof PayhubService
  */
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
  }


  sendToPayhub(req) {
    // const serviceAuthToken = this.createAuthToken(req);
    return this.getServiceAuthToken(req);
    /*
    return this.makeHttpRequest({
      uri: `${payhubUrl}card-payments`,
      body: req.body,
      method: 'POST',
      s2sToken: `${serviceAuthToken}`,
      returnUrl: `${returnUrl}`
    }, req);*/
  }

  createAuthToken(req) {
    const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
    const serviceAuthRequest = {
      microservice: microService,
      oneTimePassword: otpPassword
    };
    return this.getServiceAuthToken(serviceAuthRequest, req);
  }

  getServiceAuthToken(req) {
    const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
    const serviceAuthRequest = {
      microservice: microService,
      oneTimePassword: otpPassword
    };
    return this.makeHttpRequest({
      uri: `${s2sUrl}/lease`,
      body: serviceAuthRequest,
      method: 'POST'
    }, req);
  }
}

module.exports = PayhubService;
