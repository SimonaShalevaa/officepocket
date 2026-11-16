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

export function calculateMonthSummary(transactions, year, month) {
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const summary = {
    income: 0,
    expense: 0,
    salary: 0,
    dividend: 0,
  };

  transactions
    .filter((item) => item.date.startsWith(monthKey))
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
