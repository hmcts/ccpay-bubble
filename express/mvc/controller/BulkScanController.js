const { bulkScanService } = require('../../services');

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
  patchBSChangeStatus(req, res, appInsights) {
    return this.bulkScanService.patchBSChangeStatus(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
  getSelectedReport(req, res) {
    return this.bulkScanService.getSelectedReport(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
}

module.exports = BulkScanController;
