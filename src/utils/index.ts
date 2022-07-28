// @ts-nocheck
export const formatDate = () => {
  const newDate = new Date();
  return newDate;
};

export const getJustDate = (fullDate: Date) => new Date(fullDate.toDateString());

export const truncateContent = (content: string, maxLength = 20) => {
  const { length } = content;
  if (length >= maxLength) {
    return `${content.substring(0, maxLength)}...`;
  }
  return content;
};

export const getDates = (startDate: Date, stopDate: Date) => {
  const dateArray = [];
  const currentDate: Date = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

export const getDiffInHours = (date1 : Date, date2: Date) => {
  let diff = date1.getTime() - date2.getTime();
  diff = Math.round(Math.abs(diff / 36e5));
  return diff;
};

export const colorPallete = [
  "#595959", "#B2A24D", "#384731", "#475B42", "#64993B",
  "#4DB2A0", "#3B6899", "#4F4DB2",
  "#733D3D", "#B27D4D", "#AB4B2D", "#B24D4D", "#671D1D",
  "#8E3379", "#AC3B61",
];
