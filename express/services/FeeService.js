const config = require('config');
const request = require('request-promise-native');
const feeRegistrationUrl = config.get('fee.feeRegistrationUrl');
const feeJurisdictionUrl = config.get('fee.feeJurisdictionUrl');

class FeeService {

  getFees() {
    return request.get({ uri: feeRegistrationUrl});
  }

  getJurisdictions(req) {
    return request.get({ uri: `${feeJurisdictionUrl}${req.params.id}`});
  }
}

module.exports = FeeService;
