const config = require('config');

const payhubUrl = config.get('payhub.url');

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
      uri: `${payhubUrl}/card-payments`,
      body: req.body,
      method: 'POST'
    }, req);
  }
}

module.exports = PayhubService;
