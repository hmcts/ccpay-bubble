const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, appInsights)
      .then(result => {
        res.json({ data: result, success: true });
      })
      .catch(error => {
        res.json({ err: error, success: false });
      });
  }

  postRemission(req, res, appInsights) {
    return this.payhubService.postRemission(req, appInsights)
      .then(result => {
        res.json({ data: result, success: true });
      })
      .catch(error => {
        res.json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;