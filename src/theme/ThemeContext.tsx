import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import {
    darkColors,
    darkShadows,
    lightColors,
    lightShadows,
    radii,
    ShadowTokens,
    spacing,
    ThemeColors,
    ThemeMode,
} from "./tokens";

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  radii: typeof radii;
  spacing: typeof spacing;
  shadows: ShadowTokens;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode,
}) => {
  const systemScheme = useNativeColorScheme();

  const [userTheme, setUserTheme] = useState<ThemeMode | null>(
    initialMode ?? null,
  );

  const theme: ThemeMode =
    userTheme ?? (systemScheme === "dark" ? "dark" : "light");

  const isDark = theme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const shadows = isDark ? darkShadows : lightShadows;

  const toggleTheme = useCallback(() => {
    setUserTheme((prev) => {
      const current = prev ?? (systemScheme === "dark" ? "dark" : "light");
      return current === "dark" ? "light" : "dark";
    });
  }, [systemScheme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setUserTheme(mode);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colors,
      radii,
      spacing,
      shadows,
      setTheme,
      toggleTheme,
    }),
    [theme, isDark, colors, shadows, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
