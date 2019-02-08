const config = require('config');
const otp = require('otp');
const request = require('request-promise-native').defaults({
  proxy: 'http://proxyout.reform.hmcts.net:8080',
  strictSSL: false
});
// const request = require('request-promise-native');

const payhubUrl = config.get('payhub.url');
const ccpayBubbleReturnUrl = config.get('ccpaybubble.url');
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
    // console.log(`s2sUrl: ${  s2sUrl}`);
  //  console.log(`ccpayBubbleSecret: ${  ccpayBubbleSecret}`);
    // console.log(`microService: ${  microService}`);
    /* return this.createAuthToken().then(token => this.makeHttpRequest({
      uri: `${payhubUrl}card-payments`,
      body: req.body,
      proxy: 'http://proxyout.reform.hmcts.net:8080',
      strictSSL: false,
      method: 'POST',
      headers: {
        ServiceAuthorization: token,
        'return-url': ccpayBubbleReturnUrl
      },
      json: true
    }).catch(error => {
      console.log(`Error here is: ${JSON.stringify(error)}`);
      res.json({ err: error, success: false });
    }));*/
    return this.createAuthToken().then(token => request.post({
      uri: `${payhubUrl}card-payments`,
      body: req.body,
      headers: {
        ServiceAuthorization: token,
        'return-url': ccpayBubbleReturnUrl,
        'Content-Type': 'application/json'
      },
      json: true
    }));
  }

  createAuthToken() {
    const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
    // console.log(`otpPassword: ${  otpPassword}`);
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
