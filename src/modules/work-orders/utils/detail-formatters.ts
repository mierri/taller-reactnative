import { InspectionItemStatus } from "../types/work-order-detail.types";

export function formatDetailDate(isoString: string | null | undefined): string {
  if (!isoString) return "--";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--";

    const day = date.getDate();
    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const month = months[date.getMonth()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12 || 12;
    const hoursStr = hours.toString().padStart(2, "0");

    return `${day} ${month} · ${hoursStr}:${minutes} ${period}`;
  } catch {
    return "--";
  }
}

export function formatCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const parts = fixed.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${intPart}.${parts[1]}`;
}

export function formatNumberWithCommas(val: number): string {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getInspectionStatusLabel(status: InspectionItemStatus): string {
  switch (status) {
    case "sin_problema":
      return "Sin problema";
    case "revisar":
      return "Revisar";
    case "requiere_atencion":
      return "Requiere atención";
    default:
      return "Revisar";
  }
}

export function getInspectionStatusColor(
  status: InspectionItemStatus,
): string {
  switch (status) {
    case "sin_problema":
      return "#12805c";
    case "revisar":
      return "#b68d4f";
    case "requiere_atencion":
      return "#dc2626";
    default:
      return "#b68d4f";
  }
}

export function parseVehicleInfo(desc?: string): {
  vehicleName: string;
  plate: string;
} {
  if (!desc) return { vehicleName: "Vehículo", plate: "S/P" };
  const match = desc.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { vehicleName: match[1].trim(), plate: match[2].trim() };
  }
  return { vehicleName: desc, plate: "S/P" };
}

export function getNextInspectionStatus(
  current: InspectionItemStatus,
): InspectionItemStatus {
  switch (current) {
    case "revisar":
      return "sin_problema";
    case "sin_problema":
      return "requiere_atencion";
    case "requiere_atencion":
      return "revisar";
    default:
      return "sin_problema";
  }
}

export function calculateQuotationTotals(
  items: { total: number }[],
  applyIva: boolean,
  discountType: "PERCENT" | "FIXED",
  discountValue: number,
) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount =
    discountType === "PERCENT"
      ? (subtotal * discountValue) / 100
      : discountValue;
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = applyIva ? taxableBase * 0.16 : 0;
  const total = taxableBase + taxAmount;
  return { subtotal, discountAmount, taxAmount, total };
}

