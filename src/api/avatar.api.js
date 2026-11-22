import { storageClient, SUPABASE_URL } from "./api";

const BUCKET = "avatars";

export async function upload(userId, imageUri) {
  const fileName = `${Date.now()}.jpg`;
  const imagePath = `${userId}/${fileName}`;

  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: "image/jpeg",
  });

  await storageClient.post(`/object/${BUCKET}/${imagePath}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return imagePath;
}

export async function getUrl(imagePath) {
  const response = await storageClient.post(
    `/object/sign/${BUCKET}/${imagePath}`,
    { expiresIn: 3600 },
  );

  return `${SUPABASE_URL}/storage/v1${response.data.signedURL}`;
}

export async function remove(imagePath) {
  await storageClient.delete(`/object/${BUCKET}/${imagePath}`);
}
