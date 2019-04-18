const { payhubService } = require('../../services');
const request = require('request-promise-native');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  async sendToPayhub(req, res, appInsights) {
    const serviceAuthToken = await this.payhubService.createAuthToken();
    return this.payhubService.sendToPayhub(req, res, appInsights)
      // eslint-disable-next-line
      .then(result => {
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href,
            headers: {
              Authorization: `Bearer ${req.authToken}`,
              ServiceAuthorization: `Bearer ${serviceAuthToken}`
            }
          },
          (error, response, body) => {
            if (error) {
              return res.status(500).json({ err: `${error}`, success: false });
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${error}`, success: false });
        }
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  postRemission(req, res, appInsights) {
    return this.payhubService.postRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;