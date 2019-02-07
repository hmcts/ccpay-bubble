const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, appInsights)
      .then(result => {
        // console.log('result is: ' + JSON.stringify(result));
        res.json({ found: true, fees: result.body, success: true });
      })
      .catch(err => {
        // console.log('Error is: ' + JSON.stringify(err));
        res.json({ err: err.body, success: false });
      });
  }
}

module.exports = PayhubController;