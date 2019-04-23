const { payhubService } = require('../../services');
const request = require('request-promise-native');

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        // eslint-disable-next-line
        console.log(result._links.next_url.href);
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href
          },
          (error, response, body) => {
            if (error) {
              return res.status(500).json({ err: `${error}`, success: false });
            }
            // eslint-disable-next-line
            console.log('pci-pal-response status:', response.statusCode);
            // eslint-disable-next-line
            console.log('pci-pal-response body:', body);
            // eslint-disable-next-line
            console.log('pci-pal-response:', response);
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

  getFees(req, res) {
    return this.payhubService.getFees()
      .then(result => {
        res.status(200).send(result);
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
