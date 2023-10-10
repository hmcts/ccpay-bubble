const fs = require('fs-extra');

(function copyLcov() {
  fs.copySync('./coverage/ccpay-bubble/lcov.info', './Reset');
}());
