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

export async function create(transactionData) {
  const response = await api.post(
    "/transactions",
    transformForDatabase(transactionData),
    { headers: { Prefer: "return=representation" } },
  );

  return transformTransaction(response.data[0]);
}

export async function update(transactionId, transactionData) {
  const response = await api.patch(
    `/transactions?id=eq.${transactionId}`,
    transformForDatabase(transactionData),
    { headers: { Prefer: "return=representation" } },
  );

  return transformTransaction(response.data[0]);
}

export async function remove(transactionId) {
  await api.delete(`/transactions?id=eq.${transactionId}`);
}

function transformForDatabase(transactionData) {
  return {
    title: transactionData.title,
    type: transactionData.type,
    amount: transactionData.amount,
    is_paid: transactionData.isPaid,
  };
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
