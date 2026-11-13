import axios from "axios";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

const headers = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json",
};

export const authClient = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers,
});

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers,
});

export function setAccessToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;