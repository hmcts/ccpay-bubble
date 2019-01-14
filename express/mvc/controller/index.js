const HomeScreenController = require('./HomeScreenController');

const {
  homeScreenService
} = require('./../../services');

module.exports = {
  homeScreenController: new HomeScreenController({ response })
};
