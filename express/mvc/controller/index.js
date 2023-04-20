const PayhubController = require('./PayhubController');
const FeeController = require('./FeeController');
const BulkScanController = require('./BulkScanController');
const RefundsController = require('./RefundsController');
const NotificationController = require('./NotificationController');

const {
  payhubService,
  feeService,
  BulkScanService,
  RefundsService,
  NotificationService
} = require('./../../services');

module.exports = {
  payhubController: new PayhubController({ payhubService }),
  feeController: new FeeController({ feeService }),
  bulkScanController: new BulkScanController({ BulkScanService }),
  refundController: new RefundsController({ RefundsService }),
  notificationController: new NotificationController({ NotificationService })
};
