/* eslint-disable no-undefined */
const config = require('config');
const { fetchWithAuth } = require('./UtilService');

const notificationUrl = config.get('notification.url');


class NotificationService {

  async getRefundNotification(req) {
    const url = `${notificationUrl}/notifications/${req.params.id}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getaddressByPostcode(req) {
    const url = `${notificationUrl}/notifications/postcode-lookup/${req.params.postcode}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
    /*
    Logger.getLogger('postcode: user').info(postcodeLookupKey);
    return request.get({
      uri: `${postcodeLookupUrl}/postcode?postcode=${req.query.postcode}&KEY=${postcodeLookupKey}`,
      headers: { 'Content-Type': 'application/json' },
      json: true
    });*/
  }

  async docPreview(req) {
    const url = `${notificationUrl}/notifications/doc-preview`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    }
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }
}

module.exports = NotificationService;
