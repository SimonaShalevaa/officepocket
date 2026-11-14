import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "./AuthContext";
import { authApi } from "../../api";
import { setAccessToken } from "../../api/api";

const REFRESH_TOKEN_KEY = "refreshToken";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    restoreSession();
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

  const value = {
    user,
    isAuthenticated: !!user,
    isRestoring,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
