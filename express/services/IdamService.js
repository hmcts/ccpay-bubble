const config = require('config');
const request = require('request-promise-native');

const idamurl = config.get('idam.api_url');

class IdamService {
  getUserDetails(req) {
    Logger.getLogger('Refundservice: enter').info(req);
    Logger.getLogger('Refundservice1: enter').info(req.authToken);
    Logger.getLogger('Refundservice2: enter').info(req.headers);
    return request.get({
      uri: `${idamurl}/details`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }
}

module.exports = IdamService;