/*export const formatDate = () => {
  const newDate = new Date();
  return newDate;
};

export const getJustDate = (fullDate : Date) => new Date(fullDate.toDateString());

export const truncateContent = (content: string, maxLength = 20) => {
  const { length } = content;
  if (length >= maxLength) {
    return `${content.substring(0, maxLength)}...`;
  }
  return content;
};
Date.prototype.addDays = function(days: number) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

export const getDates = (startDate: Date, stopDate: Date) => {
  const dateArray = new Array();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
};
*/
