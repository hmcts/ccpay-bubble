const HomeScreenService = require('./HomeScreenService');

const { makeHttpRequest } = UtilService;

module.exports = {
  homeScreenService: new HomeScreenService(makeHttpRequest)
};
