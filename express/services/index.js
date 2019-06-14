const PayhubService = require('./PayhubService');
const FeeService = require('./FeeService');

module.exports = {
  payhubService: new PayhubService(),
  feeService: new FeeService()
};
