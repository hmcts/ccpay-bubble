/* eslint-disable no-else-return */
/* eslint-disable no-negated-condition */
const { notificationService } = require('../../services');

class NotificationController {
  constructor() {
    this.notificationService = notificationService;
  }
  getRefundNotification(req, res) {
    // return res.status(200).json(
    //   {
    //     notifications: [
    //       {
    //         contact_details: {
    //           date_created: '2022-01-20T10:49:33.650Z',
    //           date_updated: '2022-01-20T10:49:33.650Z',
    //           email: 'marikumar01@gmail.com'
    //         },
    //         date_created: '2022-01-20T10:49:33.650Z',
    //         date_updated: '2022-01-20T10:49:33.650Z',
    //         notification_type: 'EMAIL',
    //         reference: 'RF-1234-1234-1234-1111'
    //       },
    //       {
    //         contact_details: {
    //           date_created: '2022-01-20T10:49:33.650Z',
    //           date_updated: '2022-01-20T10:49:33.650Z',
    //           address_line: 'Flat 407, Schrier ropeworks',
    //           city: 'Barking',
    //           country: 'London',
    //           county: 'London',
    //           postal_code: 'IG117GU'
    //         },
    //         date_created: '2022-01-20T10:49:33.650Z',
    //         date_updated: '2022-01-20T10:49:33.650Z',
    //         notification_type: 'LETTER',
    //         reference: 'RF-1234-1234-1234-1111'
    //       }
    //     ]
    //   }
    // );
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
}

module.exports = NotificationController;
