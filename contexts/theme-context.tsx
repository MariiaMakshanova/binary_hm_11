import React, { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS_DARK, COLORS_LIGHT } from "../constants";
import type { ReactNode } from "react";

type ThemeType = typeof COLORS_LIGHT | typeof COLORS_DARK;
type ThemeName = "light" | "dark";

interface ThemeContextProps {
  theme: ThemeType;
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const THEME_STORAGE_KEY = "inspiration-theme";

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeName(storedTheme);
      }
    };

    void loadTheme();
  }, []);

  const theme = useMemo(
    () => (themeName === "dark" ? COLORS_DARK : COLORS_LIGHT),
    [themeName],
  );

  const toggleTheme = async () => {
    const nextTheme = themeName === "dark" ? "light" : "dark";

    setThemeName(nextTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
