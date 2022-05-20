const PayhubController = require('./PayhubController');
const FeeController = require('./FeeController');
const BulkScanController = require('./BulkScanController');
const RefundsController = require('./RefundsController');

const {
  payhubService,
  feeService,
  BulkScanService,
  RefundsService
} = require('./../../services');

module.exports = {
  payhubController: new PayhubController({ payhubService }),
  feeController: new FeeController({ feeService }),
  bulkScanController: new BulkScanController({ BulkScanService }),
  refundController: new RefundsController({ RefundsService })
};
