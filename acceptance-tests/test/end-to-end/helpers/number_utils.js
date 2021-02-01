// eslint-disable max-len
const stringUtil = require('./string_utils.js');

const NUMBER_MULTIPLIER = 9;

const NUMBER_TO_POWER = 10;

module.exports = {
  getRandomNumber(n, replace = false) {
    const mathValue = (NUMBER_MULTIPLIER * Math.pow(NUMBER_TO_POWER, n - 1));
    let number = Math.floor((Math.random() * (mathValue)) + Math.pow(NUMBER_TO_POWER, n - 1));
    const ms = stringUtil.getMillisecond();
    number = (number + ms).toString().substring(0, n);
    if (replace) return number.replace(number[0], '9');
    return number;
  }
};
