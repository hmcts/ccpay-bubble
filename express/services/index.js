const PayhubService = require('./PayhubService');
const FeeService = require('./FeeService');
const BulkScanService = require('./BulkScanService');

module.exports = {
  payhubService: new PayhubService(),
  feeService: new FeeService(),
  bulkScanService: new BulkScanService()

};
