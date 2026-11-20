import api from "./api";

export async function getAll() {
  const response = await api.get(
    "/vacations?select=*&order=start_date.desc,created_at.desc",
  );

  return response.data.map(transformVacation);
}

export async function getById(vacationId) {
  const response = await api.get(`/vacations?id=eq.${vacationId}`);

  const result = response.data.map(transformVacation);

  return result[0];
}

export async function create(vacationData) {
  const response = await api.post(
    "/vacations",
    transformForDatabase(vacationData),
    { headers: { Prefer: "return=representation" } },
  );

  return transformVacation(response.data[0]);
}

export async function update(vacationId, vacationData) {
  const response = await api.patch(
    `/vacations?id=eq.${vacationId}`,
    transformForDatabase(vacationData),
    { headers: { Prefer: "return=representation" } },
  );

  return transformVacation(response.data[0]);
}

export async function remove(vacationId) {
  await api.delete(`/vacations?id=eq.${vacationId}`);
}

function transformForDatabase(vacationData) {
  return {
    type: vacationData.type,
    start_date: vacationData.startDate,
    end_date: vacationData.endDate,
    note: vacationData.note || null,
  };
}

function transformVacation(item) {
  return {
    id: String(item.id),
    type: item.type,
    startDate: item.start_date,
    endDate: item.end_date,
    note: item.note,
  };
}
