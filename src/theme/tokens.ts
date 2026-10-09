import type { TextStyle } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  brand: {
    primary: "#006045",
    primaryText: "#006045",
    accentAmber: "#b68d4f",
  },
  text: {
    strong: "#20372d",
    label: "#3a4d3f",
    secondary: "#4d5e52",
    muted: "#5c6b60",
    placeholder: "#68766c",
    onBrand: "#ffffff",
    avatar: "#566b45",
  },
  surface: {
    app: "#e2e8de",
    shell: "rgba(244,246,239,.8)",
    glass: "rgba(244,246,239,.85)",
    nav: "rgba(248,250,244,.95)",
    sheet: "#f1f3ed",
    card: "#ffffff",
    input: "#ffffff",
    track: "rgba(233,238,225,.7)",
    tile: "#e6eee6",
    chipNeutral: "#f2f4ed",
    chipCount: "#dbe3ce",
    avatar: "#e2e9d6",
  },
  overlay: {
    scrim: "rgba(21,41,30,.35)",
  },
  border: {
    card: "rgba(255,255,255,.9)",
    glass: "rgba(255,255,255,.6)",
    input: "#e1e6de",
    button: "#dce3d7",
    divider: "#edf1e7",
    dashed: "#d1dacb",
    grabber: "#ccd5c5",
    control: "#78897c",
    focus: "#006045",
  },
  progress: {
    done: "#5f8f50",
    off: "#dde5d3",
  },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Colors = Widen<typeof light>;

export const lightColors: Colors = light;
export const darkColors: Colors = {
  brand: {
    primary: "#12805c",
    primaryText: "#5fd0a0",
    accentAmber: "#d9ad63",
  },
  text: {
    strong: "#e8f1ea",
    label: "#c3d2c7",
    secondary: "#a3b4a9",
    muted: "#8da093",
    placeholder: "#7f9386",
    onBrand: "#ffffff",
    avatar: "#9fc58e",
  },
  surface: {
    app: "#0e1612",
    shell: "rgba(22,33,27,.8)",
    glass: "rgba(22,33,27,.85)",
    nav: "rgba(15,24,19,.95)",
    sheet: "#17221c",
    card: "#1e2c24",
    input: "#1b2a21",
    track: "rgba(30,44,36,.7)",
    tile: "#1f3328",
    chipNeutral: "#213129",
    chipCount: "#2c4236",
    avatar: "#263a2e",
  },
  overlay: {
    scrim: "rgba(3,8,5,.6)",
  },
  border: {
    card: "rgba(255,255,255,.07)",
    glass: "rgba(255,255,255,.07)",
    input: "#2e4237",
    button: "#36493d",
    divider: "#25362d",
    dashed: "#3a5042",
    grabber: "#4a6054",
    control: "#6c8576",
    focus: "#5fd0a0",
  },
  progress: {
    done: "#6fb585",
    off: "#26382e",
  },
};

export type StatusFamily =
  | "neutral"
  | "archived"
  | "info"
  | "warning"
  | "violet"
  | "active"
  | "indigo"
  | "success"
  | "teal"
  | "orange"
  | "danger"
  | "late";
export type StatusTone = { bg: string; fg: string; border: string };
type StatusEntry = { label: string; family: StatusFamily };

export const statusTones: Record<
  ColorScheme,
  Record<StatusFamily, StatusTone>
> = {
  light: {
    neutral: { bg: "#edf0ea", fg: "#4d5850", border: "#cacfc8" },
    archived: { bg: "#dde2dc", fg: "#38423b", border: "#b9bfb9" },
    info: { bg: "#dfedf4", fg: "#1d5d7b", border: "#b4cdd9" },
    warning: { bg: "#f6eacb", fg: "#80530a", border: "#dcc9a1" },
    violet: { bg: "#ebe4f3", fg: "#5c3b88", border: "#ccbfdb" },
    active: { bg: "#d8e9de", fg: "#0b5a3f", border: "#abcabb" },
    indigo: { bg: "#e3e5f4", fg: "#3d46a0", border: "#bec2e2" },
    success: { bg: "#e2efd0", fg: "#3a6412", border: "#bdd0a6" },
    teal: { bg: "#d6ede9", fg: "#0c665e", border: "#aacfca" },
    orange: { bg: "#f8e3d1", fg: "#9c470e", border: "#e4c1a6" },
    danger: { bg: "#f6dfdc", fg: "#a1281f", border: "#e3b7b2" },
    late: { bg: "#b42b40", fg: "#ffffff", border: "#b42b40" },
  },
  dark: {
    neutral: { bg: "#232b26", fg: "#aab6ae", border: "#49524c" },
    archived: { bg: "#1a1f1c", fg: "#9aa69e", border: "#3e4540" },
    info: { bg: "#14303d", fg: "#8dc7e2", border: "#365a6b" },
    warning: { bg: "#3a2d10", fg: "#e9bf66", border: "#6b5628" },
    violet: { bg: "#2c2340", fg: "#c1a9e8", border: "#56496f" },
    active: { bg: "#14382a", fg: "#80d4aa", border: "#32644e" },
    indigo: { bg: "#1f2347", fg: "#a5aef2", border: "#454a77" },
    success: { bg: "#25371a", fg: "#b3dc83", border: "#4d6537" },
    teal: { bg: "#0f3733", fg: "#70d6cb", border: "#2a645e" },
    orange: { bg: "#3d2210", fg: "#f2a76c", border: "#70472a" },
    danger: { bg: "#3d1b1a", fg: "#f39a91", border: "#703f3b" },
    late: { bg: "#f27a8d", fg: "#3a0b14", border: "#f27a8d" },
  },
};

export const OperationalStatus = {
  RECIBIDA: { label: "Recibida", family: "neutral" },
  EN_DIAGNOSTICO: { label: "En Diagnóstico", family: "info" },
  EN_ESPERA_COTIZACION: { label: "En Cotización", family: "warning" },
  EN_ESPERA_APROBACION: { label: "Por Aprobar", family: "violet" },
  EN_REPARACION: { label: "En Reparación", family: "active" },
  CONTROL_CALIDAD: { label: "Control Calidad", family: "indigo" },
  LISTA_PARA_ENTREGA: { label: "Lista p/ Entrega", family: "success" },
  ENTREGADA: { label: "Entregada", family: "neutral" },
  CERRADA: { label: "Cerrada", family: "archived" },
  EN_GARANTIA: { label: "En Garantía", family: "orange" },
  CANCELADA: { label: "Cancelada", family: "danger" },
} as const satisfies Record<string, StatusEntry>;
export type OperationalStatus = keyof typeof OperationalStatus;

export const CommercialStatus = {
  SIN_COTIZAR: { label: "Sin Cotizar", family: "neutral" },
  COTIZADA: { label: "Cotizada", family: "info" },
  APROBADA_PARCIAL: { label: "Aprobada Parcial", family: "warning" },
  APROBADA_TOTAL: { label: "Aprobada Total", family: "success" },
  EN_EJECUCION: { label: "En Ejecución", family: "active" },
  CIERRE_PENDIENTE: { label: "Cierre Pendiente", family: "violet" },
  COBRADA_PARCIAL: { label: "Cobrada Parcial", family: "warning" },
  COBRADA_TOTAL: { label: "Liquidada", family: "success" },
} as const satisfies Record<string, StatusEntry>;
export type CommercialStatus = keyof typeof CommercialStatus;

export const BillingStatus = {
  NO_REQUERIDA: { label: "Sin Factura", family: "neutral" },
  PENDIENTE_DATOS: { label: "Faltan Datos SAT", family: "warning" },
  LISTA_PARA_FACTURAR: { label: "Lista p/ Facturar", family: "teal" },
  FACTURADA: { label: "Facturada (FAC)", family: "success" },
  CANCELADA: { label: "Factura Cancelada", family: "danger" },
} as const satisfies Record<string, StatusEntry>;
export type BillingStatus = keyof typeof BillingStatus;

export const QuotationLineApproval = {
  PENDING: { label: "Pendiente", family: "warning" },
  APPROVED: { label: "Aprobada ✔", family: "active" },
  REJECTED: { label: "Declinada ✖", family: "danger" },
} as const satisfies Record<string, StatusEntry>;
export type QuotationLineApproval = keyof typeof QuotationLineApproval;

export const ToolStatus = {
  DISPONIBLE: { label: "Disponible", family: "success" },
  EN_USO: { label: "En uso", family: "info" },
  EN_MANTENIMIENTO: { label: "En mantenimiento", family: "warning" },
  DADO_DE_BAJA: { label: "Dado de baja", family: "neutral" },
} as const satisfies Record<string, StatusEntry>;
export type ToolStatus = keyof typeof ToolStatus;

export const lateFlag: StatusEntry = { label: "Retrasada", family: "late" };

export const bannerFamily = {
  info: "info",
  warning: "warning",
  danger: "danger",
  success: "success",
} as const satisfies Record<string, StatusFamily>;

export const fonts = {
  ui400: "Inter_400Regular",
  ui500: "Inter_500Medium",
  ui600: "Inter_600SemiBold",
  mono400: "JetBrainsMono_400Regular",
  mono500: "JetBrainsMono_500Medium",
} as const;

export const typography = {
  displayWordmark: {
    fontFamily: fonts.ui600,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.7,
  },
  headingXl: {
    fontFamily: fonts.ui600,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  headingLg: {
    fontFamily: fonts.ui600,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  headingMd: {
    fontFamily: fonts.ui600,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  titleCard: {
    fontFamily: fonts.ui600,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  statNumber: {
    fontFamily: fonts.ui500,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -1,
  },
  input: { fontFamily: fonts.ui400, fontSize: 16, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.ui400, fontSize: 14, lineHeight: 22 },
  buttonMd: { fontFamily: fonts.ui600, fontSize: 14, lineHeight: 20 },
  labelLg: { fontFamily: fonts.ui500, fontSize: 14, lineHeight: 20 },
  bodyMd: { fontFamily: fonts.ui400, fontSize: 12, lineHeight: 18 },
  labelMd: { fontFamily: fonts.ui500, fontSize: 12, lineHeight: 16 },
  caption: { fontFamily: fonts.ui400, fontSize: 11, lineHeight: 16 },
  captionMedium: { fontFamily: fonts.ui500, fontSize: 11, lineHeight: 16 },
  eyebrow: {
    fontFamily: fonts.ui600,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  monoId: { fontFamily: fonts.mono500, fontSize: 11, lineHeight: 16 },
  monoPlate: {
    fontFamily: fonts.mono400,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} satisfies Record<string, TextStyle>;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  sheet: 32,
  full: 999,
} as const;

export const size = {
  control: { sm: 40, md: 48, lg: 52 },
  icon: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 },
  tile: { sm: 40, md: 48, hero: 80 },
  avatar: { sm: 24, md: 32 },
  checkbox: 24,
  progressBar: 4,
  touchMin: 44,
} as const;

export const borderWidth = { thin: 1, medium: 1.5, thick: 2 } as const;

export type BoxShadowLayer = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadDistance: number;
  color: string;
};

export type ShadowToken = {
  boxShadow: BoxShadowLayer[];
  legacy: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

type ShadowName =
  | "card"
  | "segmented"
  | "button"
  | "fab"
  | "floating"
  | "sheet";

export const lightShadows: Record<ShadowName, ShadowToken> = {
  card: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 8,
        spreadDistance: 0,
        color: "rgba(41,62,40,0.06)",
      },
    ],
    legacy: {
      shadowColor: "rgb(41,62,40)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  segmented: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 1.5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.1)",
      },
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 1,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.1)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 0.75,
      elevation: 1,
    },
  },
  button: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 5,
        spreadDistance: 0,
        color: "rgba(0,96,69,0.07)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,96,69)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 2.5,
      elevation: 3,
    },
  },
  fab: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 7,
        blurRadius: 12.5,
        spreadDistance: 0,
        color: "rgba(0,96,69,0.14)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,96,69)",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.14,
      shadowRadius: 6.25,
      elevation: 6,
    },
  },
  floating: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 20,
        blurRadius: 12.5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.1)",
      },
      {
        offsetX: 0,
        offsetY: 8,
        blurRadius: 5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.1)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 6.25,
      elevation: 10,
    },
  },
  sheet: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: -8,
        blurRadius: 24,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.16)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 16,
    },
  },
};

export const darkShadows: Record<ShadowName, ShadowToken> = {
  card: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 3,
        blurRadius: 12,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.25)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
    },
  },
  segmented: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 1.5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.4)",
      },
      {
        offsetX: 0,
        offsetY: 1,
        blurRadius: 1,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.3)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 0.75,
      elevation: 1,
    },
  },
  button: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.3)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2.5,
      elevation: 3,
    },
  },
  fab: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 7,
        blurRadius: 12.5,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.45)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.45,
      shadowRadius: 6.25,
      elevation: 6,
    },
  },
  floating: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 20,
        blurRadius: 14,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.35)",
      },
      {
        offsetX: 0,
        offsetY: 8,
        blurRadius: 6,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.3)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.35,
      shadowRadius: 7,
      elevation: 10,
    },
  },
  sheet: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: -8,
        blurRadius: 24,
        spreadDistance: 0,
        color: "rgba(0,0,0,0.5)",
      },
    ],
    legacy: {
      shadowColor: "rgb(0,0,0)",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 16,
    },
  },
};

export const layout = {
  frame: { width: 393, height: 852 },
  columns: 4,
  margin: 20,
  gutter: 12,
  maxContentWidth: 460,
  headerRow: 56,
  headerPaddingBottom: 8,
  bottomNavContent: 72,
  fabGapAboveNav: 16,
  rhythm: {
    section: 32,
    group: 24,
    field: 16,
    labelToField: 8,
    cardPadding: 16,
    cardPaddingLg: 20,
  },
} as const;

export function columnWidth(screenWidth: number): number {
  const content =
    Math.min(screenWidth, layout.maxContentWidth) - layout.margin * 2;
  return (content - layout.gutter * (layout.columns - 1)) / layout.columns;
}

export function span(n: number, screenWidth: number): number {
  return columnWidth(screenWidth) * n + layout.gutter * (n - 1);
}

export function getTheme(scheme: ColorScheme) {
  return {
    scheme,
    colors: scheme === "dark" ? darkColors : lightColors,
    status: statusTones[scheme],
    shadows: scheme === "dark" ? darkShadows : lightShadows,
    typography,
    fonts,
    space,
    radius,
    size,
    borderWidth,
    layout,
  };
}

export type Theme = ReturnType<typeof getTheme>;

export function statusColors(
  scheme: ColorScheme,
  family: StatusFamily,
): StatusTone {
  return statusTones[scheme][family];
}
