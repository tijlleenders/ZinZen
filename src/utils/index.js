export const formatDate = () => {
  const newDate = new Date();
  return newDate;
};

export const getJustDate = (fullDate) => new Date(fullDate.toDateString());
