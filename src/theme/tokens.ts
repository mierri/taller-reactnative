import { Platform, ViewStyle } from "react-native";

export type ThemeMode = "light" | "dark";

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  card: 22,
  xl: 24,
  sheet: 30,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const;

export const lightColors = {
  // Marca
  brandPrimary: "#006045",
  brandPrimaryText: "#006045",
  brandAccentAmber: "#b68d4f",

  // Texto
  textStrong: "#20372d",
  textLabel: "#465b44",
  textSecondary: "#758078",
  textMuted: "#8a977e",
  textPlaceholder: "#9aa397",
  textOnBrand: "#ffffff",

  // Superficies
  surfaceApp: "#e2e8de",
  surfaceShell: "rgba(244,246,239,0.8)",
  surfaceSheet: "#f1f3ed",
  surfaceCard: "rgba(255,255,255,0.9)",
  surfaceInput: "#ffffff",
  surfaceTrack: "rgba(233,238,225,0.7)",
  surfaceTile: "#e6eee6",
  surfaceChipNeutral: "#f2f4ed",
  surfaceChipCount: "#dbe3ce",
  surfaceAvatar: "#e2e9d6",
  overlayScrim: "rgba(21,41,30,0.35)",

  // Bordes y avance
  borderCard: "rgba(255,255,255,0.9)",
  borderInput: "#e1e6de",
  borderButton: "#dce3d7",
  borderDivider: "#edf1e7",
  borderDashed: "#d1dacb",
  borderGrabber: "#ccd5c5",
  progressDone: "#92ac82",
  progressOff: "#edf1e6",
  accentAvatarText: "#688153",

  // Fuera de la paleta
  sliderTrack: "#f1f5f9",
  checkboxBorder: "#767676",

  // Estados y avisos
  statusNeutralBg: "#edf0ea",
  statusNeutralFg: "#4d5850",
  statusNeutralBorder: "#cacfc8",

  statusArchivedBg: "#dde2dc",
  statusArchivedFg: "#38423b",
  statusArchivedBorder: "#b9bfb9",

  statusInfoBg: "#dfedf4",
  statusInfoFg: "#1d5d7b",
  statusInfoBorder: "#b4cdd9",

  statusWarningBg: "#f6eacb",
  statusWarningFg: "#80530a",
  statusWarningBorder: "#dcc9a1",

  statusVioletBg: "#ebe4f3",
  statusVioletFg: "#5c3b88",
  statusVioletBorder: "#ccbfdb",

  statusActiveBg: "#d8e9de",
  statusActiveFg: "#0b5a3f",
  statusActiveBorder: "#abcabb",

  statusIndigoBg: "#e3e5f4",
  statusIndigoFg: "#3d46a0",
  statusIndigoBorder: "#bec2e2",

  statusSuccessBg: "#e2efd0",
  statusSuccessFg: "#3a6412",
  statusSuccessBorder: "#bdd0a6",

  statusTealBg: "#d6ede9",
  statusTealFg: "#0c665e",
  statusTealBorder: "#aacfca",

  statusOrangeBg: "#f8e3d1",
  statusOrangeFg: "#9c470e",
  statusOrangeBorder: "#e4c1a6",

  statusDangerBg: "#f6dfdc",
  statusDangerFg: "#a1281f",
  statusDangerBorder: "#e3b7b2",

  statusLateBg: "#b42b40",
  statusLateFg: "#ffffff",
  statusLateBorder: "#b42b40",
} as const;

export const darkColors = {
  // Marca
  brandPrimary: "#12805c",
  brandPrimaryText: "#5fd0a0",
  brandAccentAmber: "#d9ad63",

  // Texto
  textStrong: "#e8f1ea",
  textLabel: "#c3d2c7",
  textSecondary: "#a3b4a9",
  textMuted: "#8da093",
  textPlaceholder: "#7f9386",
  textOnBrand: "#ffffff",

  // Superficies
  surfaceApp: "#0e1612",
  surfaceShell: "rgba(22,33,27,0.8)",
  surfaceSheet: "#17221c",
  surfaceCard: "rgba(30,44,36,0.9)",
  surfaceInput: "#1b2a21",
  surfaceTrack: "rgba(30,44,36,0.7)",
  surfaceTile: "#1f3328",
  surfaceChipNeutral: "#213129",
  surfaceChipCount: "#2c4236",
  surfaceAvatar: "#263a2e",
  overlayScrim: "rgba(3,8,5,0.6)",

  // Bordes y avance
  borderCard: "rgba(255,255,255,0.07)",
  borderInput: "#2e4237",
  borderButton: "#36493d",
  borderDivider: "#25362d",
  borderDashed: "#3a5042",
  borderGrabber: "#4a6054",
  progressDone: "#6fb585",
  progressOff: "#26382e",
  accentAvatarText: "#9fc58e",

  // Fuera de la paleta
  sliderTrack: "#1b2a21",
  checkboxBorder: "#767676",

  // Estados y avisos
  statusNeutralBg: "#232b26",
  statusNeutralFg: "#aab6ae",
  statusNeutralBorder: "#49524c",

  statusArchivedBg: "#1a1f1c",
  statusArchivedFg: "#9aa69e",
  statusArchivedBorder: "#3e4540",

  statusInfoBg: "#14303d",
  statusInfoFg: "#8dc7e2",
  statusInfoBorder: "#365a6b",

  statusWarningBg: "#3a2d10",
  statusWarningFg: "#e9bf66",
  statusWarningBorder: "#6b5628",

  statusVioletBg: "#2c2340",
  statusVioletFg: "#c1a9e8",
  statusVioletBorder: "#56496f",

  statusActiveBg: "#14382a",
  statusActiveFg: "#80d4aa",
  statusActiveBorder: "#32644e",

  statusIndigoBg: "#1f2347",
  statusIndigoFg: "#a5aef2",
  statusIndigoBorder: "#454a77",

  statusSuccessBg: "#25371a",
  statusSuccessFg: "#b3dc83",
  statusSuccessBorder: "#4d6537",

  statusTealBg: "#0f3733",
  statusTealFg: "#70d6cb",
  statusTealBorder: "#2a645e",

  statusOrangeBg: "#3d2210",
  statusOrangeFg: "#f2a76c",
  statusOrangeBorder: "#70472a",

  statusDangerBg: "#3d1b1a",
  statusDangerFg: "#f39a91",
  statusDangerBorder: "#703f3b",

  statusLateBg: "#f27a8d",
  statusLateFg: "#3a0b14",
  statusLateBorder: "#f27a8d",
} as const;

export type ThemeColors = Record<keyof typeof lightColors, string>;

export interface ShadowTokens {
  card: ViewStyle;
  segmented: ViewStyle;
  button: ViewStyle;
  fab: ViewStyle;
  floating: ViewStyle;
  sheet: ViewStyle;
}

export const lightShadows: ShadowTokens = {
  card: Platform.select({
    web: { boxShadow: "0 3px 12px rgba(41, 62, 40, .01)" } as ViewStyle,
    ios: {
      shadowColor: "#293e28",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.01,
      shadowRadius: 12,
    },
    default: { elevation: 1 },
  }),
  segmented: Platform.select({
    web: {
      boxShadow: "0 1px 1.5px rgba(0, 0, 0, .1), 0 1px 1px rgba(0, 0, 0, .1)",
    } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    },
    default: { elevation: 1 },
  }),
  button: Platform.select({
    web: { boxShadow: "0 4px 5px rgba(0, 96, 69, .07)" } as ViewStyle,
    ios: {
      shadowColor: "#006045",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 5,
    },
    default: { elevation: 2 },
  }),
  fab: Platform.select({
    web: { boxShadow: "0 7px 12.5px rgba(0, 96, 69, .14)" } as ViewStyle,
    ios: {
      shadowColor: "#006045",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.14,
      shadowRadius: 12.5,
    },
    default: { elevation: 4 },
  }),
  floating: Platform.select({
    web: {
      boxShadow: "0 20px 12.5px rgba(0, 0, 0, .1), 0 8px 5px rgba(0, 0, 0, .1)",
    } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 12.5,
    },
    default: { elevation: 6 },
  }),
  sheet: Platform.select({
    web: { boxShadow: "0 25px 25px rgba(0, 0, 0, .25)" } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
    },
    default: { elevation: 10 },
  }),
};

export const darkShadows: ShadowTokens = {
  card: Platform.select({
    web: { boxShadow: "0 3px 12px rgba(0, 0, 0, .25)" } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    default: { elevation: 2 },
  }),
  segmented: Platform.select({
    web: {
      boxShadow: "0 1px 1.5px rgba(0, 0, 0, .4), 0 1px 1px rgba(0, 0, 0, .3)",
    } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 1.5,
    },
    default: { elevation: 2 },
  }),
  button: Platform.select({
    web: { boxShadow: "0 4px 5px rgba(0, 0, 0, .3)" } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    default: { elevation: 3 },
  }),
  fab: Platform.select({
    web: { boxShadow: "0 7px 12.5px rgba(0, 0, 0, .45)" } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.45,
      shadowRadius: 12.5,
    },
    default: { elevation: 6 },
  }),
  floating: Platform.select({
    web: {
      boxShadow:
        "0 20px 12.5px rgba(0, 0, 0, .35), 0 8px 5px rgba(0, 0, 0, .3)",
    } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 12.5,
    },
    default: { elevation: 8 },
  }),
  sheet: Platform.select({
    web: { boxShadow: "0 25px 25px rgba(0, 0, 0, .5)" } as ViewStyle,
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.5,
      shadowRadius: 25,
    },
    default: { elevation: 12 },
  }),
};
