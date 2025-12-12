export const formatCalendarDate = (
  startDate: Date | null,
  endDate: Date | null
) => {
  if (!startDate) return "";

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  if (!endDate || startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
