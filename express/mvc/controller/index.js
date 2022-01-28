const PayhubController = require('./PayhubController');
const FeeController = require('./FeeController');
const BulkScanController = require('./BulkScanController');
const {
  payhubService,
  feeService,
  BulkScanService
} = require('./../../services');

module.exports = {
  payhubController: new PayhubController({ payhubService }),
  feeController: new FeeController({ feeService }),
  bulkScanController: new BulkScanController({ BulkScanService })
};
