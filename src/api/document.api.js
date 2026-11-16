import api, {
  storageClient,
  getAccessToken,
  SUPABASE_URL,
  SUPABASE_KEY,
} from "./api";

const BUCKET = "documents";

export async function getAll() {
  const response = await api.get("/documents?select=*&order=created_at.desc");

  return response.data.map(transformDocument);
}

export async function getById(documentId) {
  const response = await api.get(`/documents?id=eq.${documentId}`);

  const result = response.data.map(transformDocument);

  return result[0];
}

export async function create({ title, type, imageUri, userId }) {
  const imagePath = `${userId}/${Date.now()}.jpg`;

  await uploadImage(imagePath, imageUri);

  const response = await api.post(
    "/documents",
    { title, type, image_path: imagePath },
    { headers: { Prefer: "return=representation" } },
  );

  return transformDocument(response.data[0]);
}

export async function remove(document) {
  await api.delete(`/documents?id=eq.${document.id}`);
  await storageClient.delete(`/object/${BUCKET}/${document.imagePath}`);
}

export function getImageSource(imagePath) {
  return {
    uri: `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/${imagePath}`,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };
}

async function uploadImage(imagePath, imageUri) {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: imagePath.split("/")[1],
    type: "image/jpeg",
  });

  await storageClient.post(`/object/${BUCKET}/${imagePath}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function transformDocument(item) {
  return {
    id: String(item.id),
    title: item.title,
    type: item.type,
    imagePath: item.image_path,
    createdAt: item.created_at,
  };
}
