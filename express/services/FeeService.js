const config = require('config');
const { Logger } = require('@hmcts/nodejs-logging');
const { plainFetch } = require("./UtilService");

const feeRegistrationUrl = config.get('fee.feeRegistrationUrl');
const feeJurisdictionUrl = config.get('fee.feeJurisdictionUrl');

class FeeService {
  async getFees() {
    const logger = Logger.getLogger('FeeService');
    logger.info(`[DIAG] getFees URL: ${feeRegistrationUrl}`);
    const resp = await plainFetch(feeRegistrationUrl, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const body = await resp.buffer();
    logger.info(`[DIAG] getFees status: ${resp.status}, bytes: ${body.length}, body: ${body.toString('utf8').slice(0, 500)}`);
    return body;
  }

  async getJurisdictions(req) {
    const logger = Logger.getLogger('FeeService');
    logger.info(`[DIAG] getJurisdictions URL: ${feeJurisdictionUrl}${req.params.id}`);
    const resp = await plainFetch(`${feeJurisdictionUrl}${req.params.id}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const body = await resp.buffer();
    logger.info(`[DIAG] getJurisdictions status: ${resp.status}, bytes: ${body.length}`);
    return body;
  }
}

module.exports = FeeService;
