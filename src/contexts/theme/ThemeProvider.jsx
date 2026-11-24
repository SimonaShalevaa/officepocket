import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";

import { ThemeContext } from "./ThemeContext";
import { lightColors, darkColors } from "../../theme";

export default function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system");

  const isDarkMode =
    themeMode === "system" ? colorScheme === "dark" : themeMode === "dark";
  const colors = isDarkMode ? darkColors : lightColors;
  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [isDarkMode]);

  const value = {
    colors,
    isDarkMode,
    themeMode,
    setThemeMode,
    navigationTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
