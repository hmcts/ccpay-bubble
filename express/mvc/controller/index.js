const PayhubController = require('./PayhubController');
const FeeController = require('./FeeController');
const { payhubService } = require('./../../services');
const { feeService } = require('./../../services');

module.exports = { 
  payhubController: new PayhubController({ payhubService }),
  feeController: new FeeController({ feeService })
};
