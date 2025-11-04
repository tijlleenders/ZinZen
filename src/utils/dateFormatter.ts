export function formatDate(date: Date, formatString: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let formatted = formatString;

  // Basic format tokens
  formatted = formatted.replace(/YYYY/g, year.toString());
  formatted = formatted.replace(/YY/g, year.toString().slice(-2));
  formatted = formatted.replace(/MM/g, month.toString().padStart(2, "0"));
  formatted = formatted.replace(/M/g, month.toString());
  formatted = formatted.replace(/DD/g, day.toString().padStart(2, "0"));
  formatted = formatted.replace(/D/g, day.toString());
  formatted = formatted.replace(/HH/g, hours.toString().padStart(2, "0"));
  formatted = formatted.replace(/H/g, hours.toString());
  formatted = formatted.replace(/mm/g, minutes.toString().padStart(2, "0"));
  formatted = formatted.replace(/m/g, minutes.toString());
  formatted = formatted.replace(/ss/g, seconds.toString().padStart(2, "0"));
  formatted = formatted.replace(/s/g, seconds.toString());

  return formatted;
}
