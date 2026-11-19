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
export function formatMoney(amount) {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

export const categoryOptions = {
  income: ["Продажби", "Услуги", "Друго"],
  expense: ["Наем", "Консумативи", "Транспорт", "Комунални", "Друго"],
  salary: [],
  dividend: [],
};

export function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}
