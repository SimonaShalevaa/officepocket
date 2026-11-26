export const monthNames = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

export const shortMonthNames = [
  "Яну",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Юни",
  "Юли",
  "Авг",
  "Сеп",
  "Окт",
  "Ное",
  "Дек",
];

export const periodTypeLabels = {
  month: "Месец",
  quarter: "Тримесечие",
  year: "Година",
  custom: "Период",
};

function toKey(year, month, day) {
  const monthText = String(month + 1).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");

  return `${year}-${monthText}-${dayText}`;
}

export function getPeriodRange(periodType, year, period) {
  if (periodType === "year") {
    return { startDate: toKey(year, 0, 1), endDate: toKey(year, 11, 31) };
  }

  const firstMonth = periodType === "quarter" ? period * 3 : period;
  const lastMonth = periodType === "quarter" ? firstMonth + 2 : firstMonth;
  const lastDay = new Date(year, lastMonth + 1, 0).getDate();

  return {
    startDate: toKey(year, firstMonth, 1),
    endDate: toKey(year, lastMonth, lastDay),
  };
}

export function getPeriodTitle(periodType, year, period) {
  if (periodType === "year") {
    return String(year);
  }

  if (periodType === "quarter") {
    const firstMonth = shortMonthNames[period * 3];
    const lastMonth = shortMonthNames[period * 3 + 2];

    return `${firstMonth} – ${lastMonth} ${year}`;
  }

  return `${monthNames[period]} ${year}`;
}

export function calculateSummary(transactions, startDate, endDate) {
  const summary = {
    income: 0,
    expense: 0,
    salary: 0,
    dividend: 0,
  };

  transactions
    .filter((item) => item.date >= startDate && item.date <= endDate)
    .forEach((item) => {
      summary[item.type] += item.amount;
    });

  const totalExpenses = summary.expense + summary.salary + summary.dividend;

  return {
    ...summary,
    totalExpenses,
    balance: summary.income - totalExpenses,
  };
}

export function calculatePending(transactions) {
  const pending = transactions.filter((item) => !item.isPaid);

  return {
    count: pending.length,
    amount: pending.reduce((sum, item) => sum + item.amount, 0),
  };
}
