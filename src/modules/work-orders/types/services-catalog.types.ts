export type ServiceCategory =
  | "AFINACION_Y_MANTENIMIENTO"
  | "FRENOS_Y_SUSPENSION"
  | "MECANICA_GENERAL"
  | "MECANICA_RAPIDA"
  | "ELECTRICO_Y_DIAGNOSTICO"
  | "TORNO_Y_MAQUINADO";

export interface ServiceCatalogItem {
  id: string;
  code?: string;
  concept: string;
  category: ServiceCategory;
  system: string;
  family?: string;
  basePrice: number;
  estimatedMinutes?: number;
}

export interface PartCatalogItem {
  id: string;
  code?: string;
  concept: string;
  category: string;
  system: string;
  family?: string;
  basePrice: number;
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  AFINACION_Y_MANTENIMIENTO: "Afinación y Mantenimiento",
  FRENOS_Y_SUSPENSION: "Frenos y Suspensión",
  MECANICA_GENERAL: "Mecánica General",
  MECANICA_RAPIDA: "Mecánica Rápida",
  ELECTRICO_Y_DIAGNOSTICO: "Eléctrico y Diagnóstico",
  TORNO_Y_MAQUINADO: "Torno y Maquinado",
};

export const ALL_SERVICE_CATEGORIES: ServiceCategory[] = [
  "AFINACION_Y_MANTENIMIENTO",
  "FRENOS_Y_SUSPENSION",
  "MECANICA_RAPIDA",
  "MECANICA_GENERAL",
  "ELECTRICO_Y_DIAGNOSTICO",
  "TORNO_Y_MAQUINADO",
];

