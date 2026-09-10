const config = require('config');
const { plainFetch } = require("./UtilService");

const feeRegistrationUrl = config.get('fee.feeRegistrationUrl');
const feeJurisdictionUrl = config.get('fee.feeJurisdictionUrl');

class FeeService {
  async getFees() {
    const resp = await plainFetch(feeRegistrationUrl, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    return resp.buffer();
  }

  async getJurisdictions(req) {
    const resp = await plainFetch(`${feeJurisdictionUrl}${req.params.id}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    return resp.buffer();
  }
}

module.exports = FeeService;
