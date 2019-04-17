const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        if (result._links.next_url) {
          return res.status(200).send(result._links.next_url.href);
        }
        const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
        return res.status(500).json({ err: `${error}`, success: false });
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

  getPayment(req, res) {
    return this.payhubService.getPayment(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;