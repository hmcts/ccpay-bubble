const fs = require('fs-extra');

(function copyLcov() {
  fs.copySync('./coverage/lcov.info', './Reset');
}());