const config = require('config');

const payhubUrl = config.get('payhub.url');
const s2sToken = config.get('s2s.token');
const returnUrl = config.get('ccpaybubble.url');

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
    return this.makeHttpRequest({
      uri: `${payhubUrl}card-payments`,
      body: req.body,
      method: 'POST',
      s2sToken: `${s2sToken}`,
      returnUrl: `${returnUrl}`
    }, req);
  }
}

module.exports = PayhubService;
