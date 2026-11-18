import { File, Paths } from "expo-file-system";

import api, { storageClient, SUPABASE_URL } from "./api";

const BUCKET = "documents";

export async function getAll() {
  const response = await api.get("/documents?select=*&order=created_at.desc");

  const documents = response.data.map(transformDocument);

  if (documents.length === 0) {
    return documents;
  }

  const signResponse = await storageClient.post(`/object/sign/${BUCKET}`, {
    expiresIn: 3600,
    paths: documents.map((document) => document.imagePath),
  });

  return documents.map((document, index) => ({
    ...document,
    imageUrl: `${SUPABASE_URL}/storage/v1${signResponse.data[index].signedURL}`,
  }));
}

export async function getById(documentId) {
  const response = await api.get(`/documents?id=eq.${documentId}`);

  const result = response.data.map(transformDocument);
  const document = result[0];

  if (!document) {
    return document;
  }

  const signResponse = await storageClient.post(
    `/object/sign/${BUCKET}/${document.imagePath}`,
    { expiresIn: 3600 },
  );

  return {
    ...document,
    imageUrl: `${SUPABASE_URL}/storage/v1${signResponse.data.signedURL}`,
  };
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

export async function downloadImage(document) {
  const fileName = document.imagePath.split("/")[1];

  const file = await File.downloadFileAsync(
    document.imageUrl,
    new File(Paths.cache, fileName),
    { idempotent: true },
  );

  return file.uri;
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
