const fs = require('fs-extra');

(function rename() {
  let source = null;
  let target = null;
  process.argv.forEach(arg => {
    const parts = arg.split('=');
    if (parts[0] === 'source') {
      source = parts[1];
    } else if (parts[0] === 'destination') {
      target = parts[1];
    }
  });
  if (source && target) {
    fs.renameSync(source, target);
  } else {
    throw new Error('wrong arguments');
  }
}());