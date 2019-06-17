const { payhubService } = require('../../services');
const request = require('request-promise-native');
const HttpStatusCodes = require('http-status-codes');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href
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

  sendToPayhubWithUrl(req, res) {
    if (req.body.url) {
      return request({
        method: 'GET',
        uri: req.body.url
      })
        .then(resp => {
          res.status(200).send(resp);
        })
        .catch(err => {
          res.status(500).json({ err, success: false });
        });
    }
    return Promise.reject(new Error('Missing url parameter')).catch(err => {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ err, success: false });
    });
  }

  postCardPayment(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
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

  postPartialRemission(req, res, appInsights) {
    return this.payhubService.postPartialRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  getPayment(req, res) {
    return this.payhubService.getPayment(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  ccpayWebComponentIntegration(req, res) {
    return this.payhubService.ccpayWebComponentIntegration(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }
}

module.exports = PayhubController;
