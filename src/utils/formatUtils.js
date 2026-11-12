export const typeLabels = {
  income: "Приход",
  expense: "Разход",
  salary: "Заплата",
  dividend: "Дивидент",
};

export const documentTypeLabels = {
  invoice: "Фактура",
  receipt: "Бележка",
  contract: "Договор",
  other: "Друго",
};

export function formatAmount(amount, type) {
  const sign = type === "income" ? "+" : "−";
  const value = amount.toFixed(2).replace(".", ",");

  return `${sign}${value} €`;
}

export function formatDate(date) {
  return date.split("-").reverse().join(".");
}