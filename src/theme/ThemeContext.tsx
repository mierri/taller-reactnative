import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import {
  borderWidth,
  ColorScheme,
  Colors,
  darkColors,
  darkShadows,
  fonts,
  getTheme,
  layout,
  lightColors,
  lightShadows,
  radius,
  size,
  space,
  statusColors as getStatusColors,
  StatusFamily,
  StatusTone,
  statusTones,
  Theme,
  typography,
} from './tokens';

export type ThemeMode = ColorScheme;

function createMergedColors(c: Colors, scheme: ColorScheme) {
  const tones = statusTones[scheme];
  return {
    ...c,
    brandPrimary: c.brand.primary,
    brandPrimaryText: c.brand.primaryText,
    brandAccentAmber: c.brand.accentAmber,
    textStrong: c.text.strong,
    textLabel: c.text.label,
    textSecondary: c.text.secondary,
    textMuted: c.text.muted,
    textPlaceholder: c.text.placeholder,
    textOnBrand: c.text.onBrand,
    accentAvatarText: c.text.avatar,
    surfaceApp: c.surface.app,
    surfaceShell: c.surface.shell,
    surfaceGlass: c.surface.glass,
    surfaceNav: c.surface.nav,
    surfaceSheet: c.surface.sheet,
    surfaceCard: c.surface.card,
    surfaceInput: c.surface.input,
    surfaceTrack: c.surface.track,
    surfaceTile: c.surface.tile,
    surfaceChipNeutral: c.surface.chipNeutral,
    surfaceChipCount: c.surface.chipCount,
    surfaceAvatar: c.surface.avatar,
    overlayScrim: c.overlay.scrim,
    borderCard: c.border.card,
    borderGlass: c.border.glass,
    borderInput: c.border.input,
    borderButton: c.border.button,
    borderDivider: c.border.divider,
    borderDashed: c.border.dashed,
    borderGrabber: c.border.grabber,
    borderControl: c.border.control,
    borderFocus: c.border.focus,
    progressDone: c.progress.done,
    progressOff: c.progress.off,
    sliderTrack: '#f1f5f9',
    checkboxBorder: '#767676',
    statusNeutralBg: tones.neutral.bg,
    statusNeutralFg: tones.neutral.fg,
    statusNeutralBorder: tones.neutral.border,
    statusArchivedBg: tones.archived.bg,
    statusArchivedFg: tones.archived.fg,
    statusArchivedBorder: tones.archived.border,
    statusInfoBg: tones.info.bg,
    statusInfoFg: tones.info.fg,
    statusInfoBorder: tones.info.border,
    statusWarningBg: tones.warning.bg,
    statusWarningFg: tones.warning.fg,
    statusWarningBorder: tones.warning.border,
    statusVioletBg: tones.violet.bg,
    statusVioletFg: tones.violet.fg,
    statusVioletBorder: tones.violet.border,
    statusActiveBg: tones.active.bg,
    statusActiveFg: tones.active.fg,
    statusActiveBorder: tones.active.border,
    statusIndigoBg: tones.indigo.bg,
    statusIndigoFg: tones.indigo.fg,
    statusIndigoBorder: tones.indigo.border,
    statusSuccessBg: tones.success.bg,
    statusSuccessFg: tones.success.fg,
    statusSuccessBorder: tones.success.border,
    statusTealBg: tones.teal.bg,
    statusTealFg: tones.teal.fg,
    statusTealBorder: tones.teal.border,
    statusOrangeBg: tones.orange.bg,
    statusOrangeFg: tones.orange.fg,
    statusOrangeBorder: tones.orange.border,
    statusDangerBg: tones.danger.bg,
    statusDangerFg: tones.danger.fg,
    statusDangerBorder: tones.danger.border,
    statusLateBg: tones.late.bg,
    statusLateFg: tones.late.fg,
    statusLateBorder: tones.late.border,
  };
}

export type ThemeColors = ReturnType<typeof createMergedColors>;

export const radii = {
  ...radius,
  card: 22,
};

export const spacing = space;

export type ShadowTokens = {
  card: typeof lightShadows.card.legacy;
  segmented: typeof lightShadows.segmented.legacy;
  button: typeof lightShadows.button.legacy;
  fab: typeof lightShadows.fab.legacy;
  floating: typeof lightShadows.floating.legacy;
  sheet: typeof lightShadows.sheet.legacy;
};

function createLegacyShadows(map: typeof lightShadows): ShadowTokens {
  return {
    card: map.card.legacy,
    segmented: map.segmented.legacy,
    button: map.button.legacy,
    fab: map.fab.legacy,
    floating: map.floating.legacy,
    sheet: map.sheet.legacy,
  };
}

interface ThemeContextValue {
  theme: ThemeMode;
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
  radii: typeof radii;
  radius: typeof radius;
  spacing: typeof spacing;
  space: typeof space;
  shadows: ShadowTokens;
  typography: typeof typography;
  fonts: typeof fonts;
  size: typeof size;
  borderWidth: typeof borderWidth;
  layout: typeof layout;
  system: Theme;
  statusColors: (family: StatusFamily) => StatusTone;
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
    userTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const isDark = theme === 'dark';
  const rawColors = isDark ? darkColors : lightColors;
  const shadowMap = isDark ? darkShadows : lightShadows;

  const colors = useMemo(
    () => createMergedColors(rawColors, theme),
    [rawColors, theme],
  );

  const shadows = useMemo(() => createLegacyShadows(shadowMap), [shadowMap]);
  const systemTheme = useMemo(() => getTheme(theme), [theme]);

  const toggleTheme = useCallback(() => {
    setUserTheme((prev) => {
      const current = prev ?? (systemScheme === 'dark' ? 'dark' : 'light');
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setUserTheme(mode);
  }, []);

  const getTone = useCallback(
    (family: StatusFamily) => getStatusColors(theme, family),
    [theme],
  );

  const value = useMemo(
    () => ({
      theme,
      scheme: theme,
      isDark,
      colors,
      radii,
      radius,
      spacing,
      space,
      shadows,
      typography,
      fonts,
      size,
      borderWidth,
      layout,
      system: systemTheme,
      statusColors: getTone,
      setTheme,
      toggleTheme,
    }),
    [theme, isDark, colors, shadows, systemTheme, getTone, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
