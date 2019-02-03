const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, appInsights)
      .then(result => res.json({ found: true, fees: result.body, success: true }))
      .catch(err => res.json({ err: err.body, success: false }));
  }
}

module.exports = PayhubController;