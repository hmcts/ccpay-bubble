const config = require('config');

const ccpayUrl = config.get('ccpaybubble.url');

class HomeScreenService {
  /**
   * Constructor
   * @param {Function(Object, XMLHttpRequest)} makeHttpRequest
   */
  constructor(makeHttpRequest) {
    this.makeHttpRequest = makeHttpRequest;
    this.getHomeScreen = this.getHomeScreen.bind(this);
  }

  getHomeScreen(req) {
    return this.makeHttpRequest({
      uri: ccpayUrl,
      method: 'GET'
    }, req);
  }
}

module.exports = HomeScreenService;
