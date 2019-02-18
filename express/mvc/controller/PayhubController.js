const { payhubService } = require('../../services');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        // console.log(`Result is: ${JSON.stringify(result)}`);
        if (result._links.next_url) {
          this.nextUrl = result._links.next_url.href;
          // this.nextUrl = `https://cors-anywhere.herokuapp.com/${this.nextUrl}`;
          res.redirect(this.nextUrl);
        } else {
          const invalidJson = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${invalidJson}`, success: false });
        }
      })
      .catch(error => {
        res.status(error.statusCode).json({ err: error, success: false });
      });
  }

  postRemission(req, res, appInsights) {
    return this.payhubService.postRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(error.statusCode).json({ err: error, success: false });
      });
  }
}

module.exports = PayhubController;