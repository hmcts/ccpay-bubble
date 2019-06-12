const config = require('config');
const request = require('request-promise-native');

const feeRegistrationUrl = config.get('fee.feeRegistrationUrl');
const feeJurisdictionUrl = config.get('fee.feeJurisdictionUrl');

class FeeService {
  getFees() {
    return request.get({ uri: feeRegistrationUrl,
      headers: {
        'Cache-Control':'public, max-age=31557600'
      }
    });
  }

  getJurisdictions(req) {
    return request.get({
      uri: `${feeJurisdictionUrl}${req.params.id}`,
      headers: {
       'Cache-Control':'public, max-age=31557600'
      }
    });
  }
}

module.exports = FeeService;
