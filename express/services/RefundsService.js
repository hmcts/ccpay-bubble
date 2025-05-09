/* eslint-disable no-undefined */
const config = require('config');
const { fetchWithAuth } = require('./UtilService');
const { URL, URLSearchParams } = require('url');

const { Logger } = require('@hmcts/nodejs-logging');

const refundsUrl = config.get('refunds.url');
const idamurl = config.get('idam.api_url');

class RefundsService {
  async getRefundReason(req) {
    const url = `${refundsUrl}/refund/reasons`;
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async getRefundAction(req) {
    const url = `${refundsUrl}/refund/${req.params.id}/actions`;
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async getRefundRejectReason(req) {
    const url = `${refundsUrl}/refund/rejection-reasons`;
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async patchRefundAction(req) {
    const url = `${refundsUrl}/refund/${req.params.id}/action/${req.params[0]}`;
    const options = {
      method: 'PATCH',
      body: JSON.stringify(req.body),
    }
    Logger.getLogger('result-BUBBLE: user').info(`about to call ${url}`);
    const resp = await fetchWithAuth(url, req.authToken, options);
    Logger.getLogger('result-BUBBLE: user').info(`about to get response from ${url}`);
    const data = await resp.text();
    Logger.getLogger('result-BUBBLE: user').info(`PATCH refunds: ${data}`);
    return data;
  }

  async getRefundList(req) {
    Logger.getLogger('result-BUBBLE: user').info(req.roles);

    const url = new URL(refundsUrl);
    url.search = new URLSearchParams({
      status: req.query.status,
      excludeCurrentUser: req.query.selfExclusive
    }).toString();
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async getRefundStatusHistory(req) {
    const url = `${refundsUrl}/refund/${req.params.reference}/status-history`;
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async getRefundStatusList(req) {
    let url = '';
    if (req.query.ccdCaseNumber !== undefined && req.query.ccdCaseNumber !== '') {
      url = `${refundsUrl}/refund?ccdCaseNumber=${req.query.ccdCaseNumber}`;
    } else if (req.query.status !== undefined && req.query.status !== '') {
      url = `${refundsUrl}/refund?status=${req.query.status}&excludeCurrentUser=${req.query.excludeCurrentUser}`;
    } else {
      url = `${refundsUrl}/refund${req.params[0]}`;
    }

    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }

  async postIssueRefund(req) {
    const url = `${refundsUrl}/refund`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return await resp.json();
  }

  async patchResubmitRefund(req) {
    const url = `${refundsUrl}/refund/resubmit/${req.params.refund_reference}`;
    const options = {
      method: 'PATCH',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return await resp.json();
  }


  // getUserDetails(req) {
  //   Logger.getLogger('Refundservice: enter').info(req);
  //   Logger.getLogger('Refundservice1: enter').info(req.cookies('__auth-token'));
  //   Logger.getLogger('Refundservice2: enter').info(req.header('Auth-Dev'));
  //   Logger.getLogger('Refundservice3').info('About to call user details endpoint');
  //   return this.createAuthToken().then(() => request.get({
  //     uri: `${idamurl}/details`,
  //     headers: {
  //       Authorization: `Bearer ${req.cookies('__auth-token')}`,
  //       'Content-Type': 'application/json'
  //     },
  //     json: true
  //   }));
  // }

  async putResendOrEdit(req) {
    const url = `${refundsUrl}/refund/resend/notification/${req.params.id}${req.params[0]}?notificationType=${req.query.notificationType}`
    const options = {
      method: 'PUT',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return await resp.text();
  }

  async getUserDetails(req) {
    Logger.getLogger('Refundservice: enter').info(req);
    Logger.getLogger('Refundservice1: enter').info(req.authToken);
    Logger.getLogger('Refundservice2: enter').info(req.headers);
    const url = `${idamurl}/details`;
    const resp = await fetchWithAuth(url, req.authToken);
    return await resp.json();
  }
}

module.exports = RefundsService;
