import axios from "axios";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

let accessToken = null;

const headers = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json",
};

export const authClient = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers,
});

export const storageClient = axios.create({
  baseURL: `${SUPABASE_URL}/storage/v1`,
  headers: { apikey: SUPABASE_KEY },
});

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers,
});

export function setAccessToken(token) {
  accessToken = token;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    storageClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
    delete storageClient.defaults.headers.common.Authorization;
  }
}

export function getAccessToken() {
  return accessToken;
}

export default api;
