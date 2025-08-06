const config = require('config');
const { plainFetch } = require("./UtilService");

const feeRegistrationUrl = config.get('fee.feeRegistrationUrl');
const feeJurisdictionUrl = config.get('fee.feeJurisdictionUrl');

class FeeService {
  async getFees() {
    const resp = await plainFetch(feeRegistrationUrl, {
      headers: { 'Cache-Control': 'public, max-age=31557600' }
    });
    return resp.buffer();
  }

  async getJurisdictions(req) {
    const resp = await plainFetch(`${feeJurisdictionUrl}${req.params.id}`, {
      headers: { 'Cache-Control': 'public, max-age=31557600' }
    });
    return resp.buffer();
  }
}

module.exports = FeeService;
