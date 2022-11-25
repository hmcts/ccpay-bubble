/* eslint-disable no-else-return */
/* eslint-disable no-negated-condition */
const { notificationService } = require('../../services');

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
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }
  getaddressByPostcode(req, res) {
    return this.notificationService.getaddressByPostcode(req)
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
  docPreview(req, res) {
    /* eslint-disable no-console */
    console.log(this.notificationService.docPreview(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      }));
  }
}

module.exports = NotificationController;
