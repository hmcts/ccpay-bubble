const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        if (result._links.next_url) {
          this.nextUrl = result._links.next_url.href;
          res.redirect(this.nextUrl);
          res.json({ data: 'Redirected to payment page', success: true });
        } else {
          const invalidJson = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          res.json({ err: `${invalidJson}`, success: false });
        }
      })
      .catch(error => {
        res.json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;