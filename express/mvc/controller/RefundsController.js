/* eslint-disable no-else-return */
/* eslint-disable no-negated-condition */
const { refundsService } = require('../../services');
const {errorHandler} = require("../../services/UtilService");
const { Logger } = require('@hmcts/nodejs-logging');

class RefundsController {
  constructor() {
    this.refundsService = refundsService;
  }
  getRefundReason(req, res) {
    return this.refundsService.getRefundReason(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getRefundAction(req, res) {
    return this.refundsService.getRefundAction(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getRefundRejectReason(req, res) {
    return this.refundsService.getRefundRejectReason(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  patchRefundAction(req, res, appInsights) {
    return this.refundsService.patchRefundAction(req, appInsights)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getRefundList(req, res) {
    return this.refundsService.getRefundList(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getRefundStatusHistory(req, res) {
    return this.refundsService.getRefundStatusHistory(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  putResendOrEdit(req, res, appInsights) {
    return this.refundsService.putResendOrEdit(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getRefundStatusList(req, res) {
    return this.refundsService.getRefundStatusList(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  postIssueRefund(req, res, appInsights) {
    return this.refundsService.postIssueRefund(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postReIssueExpiredRefund(req, res, appInsights) {
    return this.refundsService.postReIssueExpiredRefund(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  patchResubmitRefund(req, res, appInsights) {
    return this.refundsService.patchResubmitRefund(req, appInsights)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getRefundsReport(req, res) {
    Logger.getLogger('Get-Refunds-Report').info(req);
    return this.refundsService.getRefundsReport(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getUserDetails(req, res, appInsights) {
    Logger.getLogger('Get-User-Details').info(req);
    return this.refundsService.getUserDetails(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: JSON.stringify(result.body), success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
}

module.exports = RefundsController;
