const UtilService = require('./UtilService');
const PayhubService = require('./PayhubService');

const { makeHttpRequest } = UtilService;

module.exports = {
  payhubService: new PayhubService(makeHttpRequest),
  utilService: UtilService
};
