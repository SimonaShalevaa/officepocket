import api, { authClient, SUPABASE_URL } from "./api";

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

export async function updateName(name) {
  const response = await api.put(`${SUPABASE_URL}/auth/v1/user`, {
    data: { name },
  });

  return transformUser(response.data);
}

export async function updateAvatarPath(avatarPath) {
  const response = await api.put(`${SUPABASE_URL}/auth/v1/user`, {
    data: { avatar_path: avatarPath },
  });

  return transformUser(response.data);
}

function transformSession(data) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: transformUser(data.user),
  };
}

function transformUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name ?? user.email.split("@")[0],
    avatarPath: user.user_metadata?.avatar_path ?? null,
  };
}