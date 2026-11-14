import { authClient } from "./api";

export async function register(name, email, password) {
  const response = await authClient.post("/signup", {
    email,
    password,
    data: { name },
  });

  return transformSession(response.data);
}

export async function login(email, password) {
  const response = await authClient.post("/token?grant_type=password", {
    email,
    password,
  });

  return transformSession(response.data);
}

export async function refreshSession(refreshToken) {
  const response = await authClient.post("/token?grant_type=refresh_token", {
    refresh_token: refreshToken,
  });

  return transformSession(response.data);
}

function transformSession(data) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name ?? data.user.email.split("@")[0],
    },
  };
}