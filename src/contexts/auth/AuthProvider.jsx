import { useState } from "react";

import { AuthContext } from "./AuthContext";
import { authApi } from "../../api";
import { setAccessToken } from "../../api/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const saveSession = (session) => {
    setAccessToken(session.accessToken);
    setUser(session.user);
  };

  const login = async (email, password) => {
    const session = await authApi.login(email, password);
    saveSession(session);
  };

  const register = async (name, email, password) => {
    const session = await authApi.register(name, email, password);
    saveSession(session);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}