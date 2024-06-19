const { bulkScanService } = require('../../services');
const {errorHandler} = require("../../services/UtilService");

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
        return errorHandler(res, error);
      });
  }

  getPaymentDetailsForCcd(req, res) {
    return this.bulkScanService.getPaymentDetailsForCcd(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  patchBSChangeStatus(req, res, appInsights) {
    return this.bulkScanService.patchBSChangeStatus(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getSelectedReport(req, res) {
    return this.bulkScanService.getSelectedReport(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
}

module.exports = BulkScanController;
