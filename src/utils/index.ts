export const formatDate = () => {
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
