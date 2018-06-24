/**
 * 该函数用来获取某年某月有多少天
 * @param {Number} year 年份
 * @param {Number} month 月份 以0开始
 * @return {Number} 天数
 */
function getMonthDay(year, month) {
  return (new Date(year, month + 1, 0)).getDate();
}

/**
 * 该函数用来生成项目要用的元素为每天的月份数组
 * @param {Number} year 年份
 * @param {Number} month 月份 以0开始
 * @return {Array} 月份数组
 */
function generateMonthArray(year, month) {
  const today = new Date(),
    finalArray = [];

  let monthDays = getMonthDay(year, month);

  if (year === today.getFullYear() && month === today.getMonth()) {
    monthDays = today.getDate();
  }

  for (let index = 0; index < monthDays; index++) {
    const day = new Date(year, month, index + 1);

    finalArray.push({
      id: +day,
      year,
      month,
      day: index + 1,
      weekDay: day.getDay()
    });
  }

  return finalArray;
}

const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export {
  getMonthDay,
  generateMonthArray,
  monthArray,
  weekDayArray
};
