const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, appInsights)
      .then(result => {
        // console.log(`result is: ${JSON.stringify(result)}`);
        res.json({ rawData: result, data: result.body, success: true });
      })
      .catch(error => {
        // console.log(`Error is: ${JSON.stringify(error)}`);
        res.json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;