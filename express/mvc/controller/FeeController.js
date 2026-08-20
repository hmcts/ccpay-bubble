const { feeService } = require('../../services');
const {errorHandler} = require("../../services/UtilService");

class FeeController {
  constructor() {
    this.feeService = feeService;
  }

  getFees(req, res) {
    return this.feeService.getFees()
      .then(result => {
        res.set('Cache-Control', 'no-store');
        res.status(200).send(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getJurisdictions(req, res) {
    return this.feeService.getJurisdictions(req)
      .then(result => {
        res.set('Cache-Control', 'no-store');
        res.status(200).send(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
}

module.exports = FeeController;
