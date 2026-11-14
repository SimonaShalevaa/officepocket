import api from "./api";

export async function getAll() {
  const response = await api.get(
    "/transactions?select=*&order=date.desc,created_at.desc",
  );

  return response.data.map(transformTransaction);
}

export async function getById(transactionId) {
  const response = await api.get(`/transactions?id=eq.${transactionId}`);

  const result = response.data.map(transformTransaction);

  return result[0];
}

function transformTransaction(item) {
  return {
    id: String(item.id),
    title: item.title,
    type: item.type,
    category: item.category,
    amount: Number(item.amount),
    date: item.date,
    isPaid: item.is_paid,
  };
}
