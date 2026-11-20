import { parseDate, toDateString } from "./formatUtils";

export const DEFAULT_VACATION_DAYS = 20;

export const vacationTypeLabels = {
  paid: "Платен",
  unpaid: "Неплатен",
  sick: "Болничен",
};

export const vacationStatusLabels = {
  upcoming: "ПРЕДСТОИ",
  current: "ТЕКУЩ",
  used: "ИЗПОЛЗВАН",
};

export function countWorkingDays(startDate, endDate) {
  const current = parseDate(startDate);
  const end = parseDate(endDate);
  let count = 0;

  while (current <= end) {
    const day = current.getDay();

    if (day !== 0 && day !== 6) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function getVacationStatus(vacation) {
  const today = toDateString(new Date());

  if (vacation.startDate > today) {
    return "upcoming";
  }

  if (vacation.endDate < today) {
    return "used";
  }

  return "current";
}

export function calculatePaidDaysInYear(vacations, year) {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  return vacations
    .filter((item) => item.type === "paid")
    .filter((item) => item.startDate <= yearEnd && item.endDate >= yearStart)
    .reduce((sum, item) => {
      const start = item.startDate < yearStart ? yearStart : item.startDate;
      const end = item.endDate > yearEnd ? yearEnd : item.endDate;

      return sum + countWorkingDays(start, end);
    }, 0);
}
