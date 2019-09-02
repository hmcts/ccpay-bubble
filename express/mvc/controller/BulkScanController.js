const { bulkScanService } = require('../../services');
const request = require('request-promise-native');
const HttpStatusCodes = require('http-status-codes');

class BulkScanController {
  constructor() {
    this.bulkScanService = bulkScanService;
  }

  getPaymentDetailsForDcn(req, res) {
    return this.bulkScanService.getPaymentDetailsForDcn(req)
      .then(result => {
       res.status(200).json({ data: result, success: true });
         })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  getPaymentDetailsForCcd(req, res) {
    return this.bulkScanService.getPaymentDetailsForCcd(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
 
}

module.exports = BulkScanController;
