const { feeService } = require('../../services');

class FeeController {
  constructor() {
    this.feeService = feeService;
  }

  getFees(req, res) {
    return this.feeService.getFees()
      .then(result => {
        res.status(200).send(result);
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  getJurisdictions(req, res) {
    return this.feeService.getJurisdictions(req)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
}

module.exports = FeeController;
