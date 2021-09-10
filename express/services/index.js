const PayhubService = require('./PayhubService');
const FeeService = require('./FeeService');
const BulkScanService = require('./BulkScanService');
const RefundsService = require('./RefundsService');
const IdamService = require('./IdamService');

module.exports = {
  payhubService: new PayhubService(),
  feeService: new FeeService(),
  bulkScanService: new BulkScanService(),
  refundsService: new RefundsService(),
  idamService: new IdamService()
};
