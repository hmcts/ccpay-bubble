const { idamService } = require('../../services');

class IdamController {
  constructor() {
    this.idamService = idamService;
  }

  getUserDetails(req, res) {
    return this.idamService.getUserDetails(req)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
}

module.exports = IdamController;