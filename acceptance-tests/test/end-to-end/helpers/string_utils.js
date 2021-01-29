
function getDayMonthYear()
{
  var date = new Date();
  var day = date.getDate().toString().padStart(2,"0");
  var month = (date.getMonth() + 1).toString().padStart(2,"0");
  var year = date.getFullYear().toString();
  return [day, month, year]

};

function getTime()
{
  var date = new Date();
  var hour = date.getHours().toString().padStart(2,"0");
  var mins = date.getMinutes().toString().padStart(2,"0");
  var secs =  date.getSeconds().toString().padStart(2,"0");
  return [hour,mins,secs]
};

function getDateAndTimeInString()
{
  var todayDate = getDayMonthYear();
  var todayTime = getTime()

  return (todayDate + todayTime).toString().split(",").join("");

};

function getDateInYYYYMMDD()
{
  var todayDate = getDayMonthYear();
  return todayDate[2] + "-" + todayDate[1] + "-" + todayDate[0] ;
};


module.exports = { getDateAndTimeInString, getDateInYYYYMMDD }
