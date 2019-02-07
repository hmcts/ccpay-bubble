const config = require('config');
const otp = require('otp');
const request = require('request-promise-native');

// const payhubUrl = config.get('payhub.url');
// const ccpayBubbleReturnUrl = config.get('ccpaybubble.url');
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
    // console.log('s2sUrl: ' + s2sUrl);
    // console.log('ccpayBubbleSecret: ' + ccpayBubbleSecret);
    // console.log('microService: ' + microService);
    return this.createAuthToken(req).then(token => {
      // console.log('token: ' + token);
      return { authToken: token };
    })
      .catch(err => {
        // console.log('Error in token: ' + JSON.stringify(err));
        res.json({ err: err.body, success: false });
      });
    /*
    return this.createAuthToken(req).then(token => this.makeHttpRequest({
      uri: `${payhubUrl}card-payments`,
      body: req.body,
      method: 'POST',
      s2sToken: token,
      returnUrl: ccpayBubbleReturnUrl
    }, req));*/
  }

  createAuthToken(req) {
    const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
    // console.log('otpPassword: ' + otpPassword);
    const serviceAuthRequest = {
      microservice: microService,
      oneTimePassword: otpPassword
    };
    return this.getServiceAuthToken(serviceAuthRequest, req);
  }

  getServiceAuthToken(serviceAuthRequest) {
    return request.post({
      uri: `${s2sUrl}/lease`,
      body: serviceAuthRequest,
      json: true
    });
  }
}

module.exports = PayhubService;
