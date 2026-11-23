import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "./AuthContext";
import { authApi, avatarApi } from "../../api";
import {
  setAccessToken,
  setOnSessionExpired,
  REFRESH_TOKEN_KEY,
} from "../../api/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    restoreSession();

    setOnSessionExpired(async () => {
      await clearSession();
      Alert.alert("Сесията изтече", "Моля, влезте отново в профила си.");
    });
  }, []);

  const saveSession = async (session) => {
    setAccessToken(session.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
    setUser(session.user);
  };

  const clearSession = async () => {
    setAccessToken(null);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setUser(null);
  };

  const restoreSession = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (refreshToken) {
        const session = await authApi.refreshSession(refreshToken);
        await saveSession(session);
      }
    } catch (error) {
      await clearSession();
    } finally {
      setIsRestoring(false);
    }
  };

  const login = async (email, password) => {
    const session = await authApi.login(email, password);
    await saveSession(session);
  };

  const register = async (name, email, password) => {
    const session = await authApi.register(name, email, password);
    await saveSession(session);
  };

  const logout = async () => {
    await clearSession();
  };

  const refreshUser = async () => {
    const updatedUser = await authApi.getUser();
    setUser(updatedUser);
  };

  const updateName = async (name) => {
    const updatedUser = await authApi.updateName(name);
    setUser(updatedUser);
  };

  const checkPassword = async (password) => {
    await authApi.login(user.email, password);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const session = await authApi.login(user.email, currentPassword);
    await saveSession(session);
    await authApi.updatePassword(newPassword);
  };

  const updateAvatar = async (imageUri) => {
    const oldPath = user.avatarPath;
    const newPath = await avatarApi.upload(user.id, imageUri);
    const updatedUser = await authApi.updateAvatarPath(newPath);
    setUser(updatedUser);

    if (oldPath) {
      await avatarApi.remove(oldPath).catch(() => {});
    }
  };

  const removeAvatar = async () => {
    const oldPath = user.avatarPath;
    const updatedUser = await authApi.updateAvatarPath(null);
    setUser(updatedUser);

    if (oldPath) {
      await avatarApi.remove(oldPath).catch(() => {});
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isRestoring,
    login,
    register,
    logout,
    updateName,
    refreshUser,
    updateAvatar,
    removeAvatar,
    changePassword,
    checkPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
