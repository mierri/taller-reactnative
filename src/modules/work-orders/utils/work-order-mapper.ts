import { OperationalStatus as OperationalStatusTokens } from '@/theme/tokens';
import type { StatusFamily } from '@/theme/tokens';
import {
  OperationalStatus,
  WorkOrderCardModel,
  WorkOrderCategory,
  WorkOrderDto,
} from '../types/work-order.types';

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const DAYS_ES = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
];

const MONTHS_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

export function getFormattedDate(): string {
  const now = new Date();
  const dayName = DAYS_ES[now.getDay()];
  const dayNumber = now.getDate();
  const monthName = MONTHS_ES[now.getMonth()];
  return `${dayName}, ${dayNumber} DE ${monthName}`;
}

export function formatDeadline(dateString?: string | null): string {
  if (!dateString) return 'Sin fecha';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = MONTHS_SHORT[date.getMonth()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12 || 12;
    const hoursStr = hours.toString().padStart(2, '0');

    return `${day} ${month} · ${hoursStr}:${minutes} ${period}`;
  } catch {
    return dateString ?? 'Sin fecha';
  }
}

export function parseVehicleDescription(desc?: string): {
  vehicle: string;
  plate: string;
} {
  if (!desc) {
    return { vehicle: 'Vehículo', plate: '' };
  }

  const match = desc.match(/^(.*?)(?:\s*\(([^)]+)\))?$/);
  if (match) {
    const vehicle = match[1]?.trim() || 'Vehículo';
    const plate = match[2]?.trim() || '';
    return { vehicle, plate };
  }

  return { vehicle: desc, plate: '' };
}

export function getOperationalStatusLabel(status: OperationalStatus): string {
  const tokenEntry = OperationalStatusTokens[status as keyof typeof OperationalStatusTokens];
  if (tokenEntry) {
    return tokenEntry.label;
  }
  return status;
}

export function getOperationalBadgeType(
  status: OperationalStatus,
): StatusFamily {
  const tokenEntry = OperationalStatusTokens[status as keyof typeof OperationalStatusTokens];
  if (tokenEntry) {
    return tokenEntry.family;
  }
  return 'neutral';
}

export function getOperationalProgress(status: OperationalStatus): number {
  switch (status) {
    case OperationalStatus.RECIBIDA:
      return 1;
    case OperationalStatus.EN_DIAGNOSTICO:
      return 2;
    case OperationalStatus.EN_ESPERA_COTIZACION:
    case OperationalStatus.EN_ESPERA_APROBACION:
      return 3;
    case OperationalStatus.EN_REPARACION:
      return 4;
    case OperationalStatus.CONTROL_CALIDAD:
      return 5;
    case OperationalStatus.LISTA_PARA_ENTREGA:
    case OperationalStatus.ENTREGADA:
    case OperationalStatus.CERRADA:
      return 6;
    default:
      return 1;
  }
}

export function getWorkOrderCategory(
  status: OperationalStatus,
): WorkOrderCategory {
  switch (status) {
    case OperationalStatus.EN_ESPERA_COTIZACION:
    case OperationalStatus.EN_ESPERA_APROBACION:
      return 'cotizando';
    case OperationalStatus.LISTA_PARA_ENTREGA:
    case OperationalStatus.ENTREGADA:
    case OperationalStatus.CERRADA:
      return 'listas';
    default:
      return 'taller';
  }
}

export function mapWorkOrderToCard(order: WorkOrderDto): WorkOrderCardModel {
  const { vehicle, plate } = parseVehicleDescription(order.vehicleDescription);
  const advisor = order.serviceAdvisorName || 'Asesor';
  const advisorInitial = advisor.charAt(0).toUpperCase();
  const statusFamily = getOperationalBadgeType(order.operationalStatus);

  return {
    id: order.id,
    folio: order.code,
    deadline: formatDeadline(order.estimatedDelivery),
    vehicle,
    plate,
    client: order.clientName || 'Cliente',
    status: getOperationalStatusLabel(order.operationalStatus),
    statusFamily,
    statusType: statusFamily,
    category: getWorkOrderCategory(order.operationalStatus),
    advisor,
    advisorInitial,
    progress: getOperationalProgress(order.operationalStatus),
    isLate: order.estaRetrasada,
    original: order,
  };
}
