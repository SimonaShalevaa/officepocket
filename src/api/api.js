import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const REFRESH_TOKEN_KEY = "refreshToken";

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

let refreshPromise = null;
let onSessionExpired = null;

export function setAccessToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    storageClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
    delete storageClient.defaults.headers.common.Authorization;
  }
}

export function setOnSessionExpired(callback) {
  onSessionExpired = callback;
}

function isTokenExpired(error) {
  const status = error.response?.status;
  const message = String(error.response?.data?.message ?? "").toLowerCase();

  return status === 401 || message.includes("jwt");
}

async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  const response = await authClient.post("/token?grant_type=refresh_token", {
    refresh_token: refreshToken,
  });

  setAccessToken(response.data.access_token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refresh_token);

  return response.data.access_token;
}

async function handleResponseError(error) {
  const originalRequest = error.config;

  if (!originalRequest || originalRequest.isRetry || !isTokenExpired(error)) {
    return Promise.reject(error);
  }

  originalRequest.isRetry = true;

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return axios(originalRequest);
  } catch (refreshError) {
    if (onSessionExpired) {
      onSessionExpired();
    }

    return Promise.reject(refreshError);
  }
}

api.interceptors.response.use((response) => response, handleResponseError);
storageClient.interceptors.response.use(
  (response) => response,
  handleResponseError,
);

export default api;
