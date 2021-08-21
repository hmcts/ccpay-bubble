const { refundsService } = require('../../services');

class RefundsController {
  constructor() {
    this.refundsService = refundsService;
  }
  getRefundReason(req, res) {
    return this.refundsService.getRefundReason(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  postIssueRefund(req, res, appInsights) {
    return this.refundsService.postIssueRefund(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  getUserDetails(req, res, appInsights) {
    Logger.getLogger('Get-User-Details').info(req);
    return this.refundsService.getUserDetails(req, res, appInsights)
      .then(result => {
        Logger.getLogger('Get-User-Details1').info(result);
        // res.cookie(constants.USER_COOKIE, JSON.stringify(result));
        Logger.getLogger('Get-User-Details1').info(JSON.stringify(result));
        res.status(200).json({ data: JSON.stringify(result), success: true });
        // res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }
}

module.exports = RefundsController;
