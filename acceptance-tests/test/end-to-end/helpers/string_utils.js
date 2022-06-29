// eslint-disable max-len
const stringFillSize = 2;

function getDayMonthYear(date = null) {
  let newDate = null;
  if (date === null) {
    newDate = new Date();
  } else {
    newDate = date;
  }
  const day = newDate.getDate().toString()
    .padStart(stringFillSize, '0');
  const month = (newDate.getMonth() + 1).toString().padStart(stringFillSize, '0');
  const year = newDate.getFullYear().toString();
  return [day, month, year];
}

function getMillisecond(date = null) {
  let newDate = null;
  if (date === null) {
    newDate = new Date();
  } else {
    newDate = date;
  }
  const ms = newDate.getMilliseconds().toString();
  return ms;
}

function getTime(date = null) {
  let newDate = null;
  if (date === null) {
    newDate = new Date();
  } else {
    newDate = date;
  }
  const hour = newDate.getHours().toString()
    .padStart(stringFillSize, '0');
  const mins = newDate.getMinutes().toString()
    .padStart(stringFillSize, '0');
  const secs = newDate.getSeconds().toString()
    .padStart(stringFillSize, '0');
  return [hour, mins, secs];
}

function getTodayDateAndTimeInString() {
  const todayDate = getDayMonthYear();
  const todayTime = getTime();

  return (todayDate + todayTime).toString().split(',')
    .join('');
}

function getTodayDateInYYYYMMDD() {
  const todayDate = getDayMonthYear();
  return `${todayDate[2]}-${todayDate[1]}-${todayDate[0]}`;
}

function getTodayDateInDDMMYYY() {
  const todayDate = getDayMonthYear();
  return `${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`;
}

function getCcdCaseInFormat(ccdNumber) {
  return (ccdNumber.match(/(.{1,4})/g)).join('-');
}

module.exports = {
  getTodayDateAndTimeInString,
  getTodayDateInYYYYMMDD, getTodayDateInDDMMYYY,
  getCcdCaseInFormat, getMillisecond
};
