const PayhubController = require('./PayhubController');

const { payhubService } = require('./../../services');

module.exports = { payhubController: new PayhubController({ payhubService }) };
