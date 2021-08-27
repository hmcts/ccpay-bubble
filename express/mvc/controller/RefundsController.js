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
  getRefundAction(req, res) {
    return this.refundsService.getRefundAction(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode !== '403' && error.statusCode !== '500') {
          res.status(error.statusCode).json({
            err: error.message,
            statuCode: error.statusCode,
            success: false
          });
        } else {
          res.status(500).json({ err: error, statuCode: 500, success: false });
        }
      });
  }
  getRefundRejectReason(req, res) {
    return this.refundsService.getRefundRejectReason(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode !== '403' && error.statusCode !== '500') {
          res.status(error.statusCode).json({
            err: error.message,
            statuCode: error.statusCode,
            success: false
          });
        } else {
          res.status(500).json({ err: error, statuCode: 500, success: false });
        }
      });
  }
  patchRefundAction(req, res) {
    return this.refundsService.patchRefundAction(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode !== '403' && error.statusCode !== '500') {
          res.status(error.statusCode).json({
            err: error.message,
            statuCode: error.statusCode,
            success: false
          });
        } else {
          res.status(500).json({ err: error, statuCode: 500, success: false });
        }
      });
  }

  getRefundList(req, res) {
    if(req.query.status === undefined) {
      return this.refundsService.getRefundList(req)
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
    } else {
      return this.refundsService.getRefundList1(req)
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
        Logger.getLogger('Get-User-Details1').info(result.body);
        // res.cookie(constants.USER_COOKIE, JSON.stringify(result));
        Logger.getLogger('Get-User-Details1').info(JSON.stringify(result.body));
        res.status(200).json({ data: JSON.stringify(result.body), success: true });
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
