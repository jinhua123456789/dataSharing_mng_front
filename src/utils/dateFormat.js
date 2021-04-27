export function convertDateToYearMonthDay(date) {
  return date.split("T")[0];
}

export function convertDateToYearMonth(date) {
  return date.substring(0, 7);
}
