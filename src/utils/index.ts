export const formatDate = () => {
  const newDate = new Date();
  return newDate;
};

export const getJustDate = (fullDate : Date) => new Date(fullDate.toDateString());
