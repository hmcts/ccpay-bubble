const fs = require('fs-extra');

(function replace() {
  let searchValue = null;
  let newValue = null;
  let file = null;
  process.argv.forEach(arg => {
    const parts = arg.split('=');
    if (parts[0] === 'searchValue') {
      searchValue = parts.reduce((acc, val, idx) => {
        if (idx > 0) {
          return acc + (acc ? '=' : '') + val;
        }
        return acc;
      }, '');
    } else if (parts[0] === 'newValue') {
      newValue = parts.reduce((acc, val, idx) => {
        if (idx > 0) {
          return acc + (acc ? '=' : '') + val;
        }
        return acc;
      }, '');
    } else if (parts[0] === 'file') {
      file = parts[1];
    }
  });
  if (searchValue && newValue && file) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        throw new Error('reading file failed: ', err);
      }
      const regExp = new RegExp(searchValue, 'g');
      const result = data.replace(regExp, newValue);
      fs.writeFile(file, result, 'utf8', writeError => {
        if (writeError) throw new Error('writing file failed: ', writeError);
      });
    });
  } else {
    throw new Error('wrong arguments');
  }
}());
