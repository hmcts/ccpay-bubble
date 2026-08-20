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
    const text = body.toString('utf8');
    let diag = `status: ${resp.status}, bytes: ${body.length}`;
    try {
      const fees = JSON.parse(text);
      const pb = (fees || []).filter(f => f.description && String(f.description).toLowerCase().includes('paybubble'));
      diag += `, totalFees: ${(fees || []).length}`;
      diag += `, payBubbleFees: ${pb.length}`;
      diag += `, payBubbleCodes: [${pb.map(f => `${f.code}(${f.current_version && f.current_version.status}@${f.current_version && f.current_version.valid_from}-${f.current_version && f.current_version.valid_to || ''})`).join(', ')}]`;
    } catch (e) {
      diag += `, body: ${text.slice(0, 500)}`;
    }
    logger.info(`[DIAG] getFees ${diag}`);
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
