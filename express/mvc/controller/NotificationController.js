/* eslint-disable no-else-return */
/* eslint-disable no-negated-condition */
const { notificationService } = require('../../services');
const {errorHandler} = require("../../services/UtilService");

class NotificationController {
  constructor() {
    this.notificationService = notificationService;
  }
  getRefundNotification(req, res) {
    return this.notificationService.getRefundNotification(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getaddressByPostcode(req, res) {
    return this.notificationService.getaddressByPostcode(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  docPreview(req, res) {
    return this.notificationService.docPreview(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
}

module.exports = NotificationController;
