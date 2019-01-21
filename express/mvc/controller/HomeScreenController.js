const { homeScreenService } = require('../../services');

class HomeScreenController {
  constructor() {
    this.homeScreenService = homeScreenService;

    this.getHomePage = this.getHomePage.bind(this);
  }

  getHomePage(req, res) {
    return this.homeScreenService.getHomePage(req)
      .then(data => this.response(res, data.body))
      .catch(err => response(res, { message: err.message }, HttpStatusCodes.BAD_REQUEST));
  }
}

module.exports = HomeScreenController;
