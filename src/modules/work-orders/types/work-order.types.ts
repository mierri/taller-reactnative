import type { StatusFamily } from '@/theme/tokens';

export enum OperationalStatus {
  RECIBIDA = 'RECIBIDA',
  EN_DIAGNOSTICO = 'EN_DIAGNOSTICO',
  EN_ESPERA_COTIZACION = 'EN_ESPERA_COTIZACION',
  EN_ESPERA_APROBACION = 'EN_ESPERA_APROBACION',
  EN_REPARACION = 'EN_REPARACION',
  CONTROL_CALIDAD = 'CONTROL_CALIDAD',
  LISTA_PARA_ENTREGA = 'LISTA_PARA_ENTREGA',
  ENTREGADA = 'ENTREGADA',
  CERRADA = 'CERRADA',
  EN_GARANTIA = 'EN_GARANTIA',
  CANCELADA = 'CANCELADA',
}

export enum CommercialStatus {
  SIN_COTIZAR = 'SIN_COTIZAR',
  COTIZADA = 'COTIZADA',
  APROBADA_TOTAL = 'APROBADA_TOTAL',
  APROBADA_PARCIAL = 'APROBADA_PARCIAL',
  RECHAZADA = 'RECHAZADA',
  EN_EJECUCION = 'EN_EJECUCION',
}

export enum BillingStatus {
  PENDIENTE = 'PENDIENTE',
  FACTURADA = 'FACTURADA',
  NO_FACTURABLE = 'NO_FACTURABLE',
}

export interface WorkOrderDto {
  id: string;
  workshopId: string;
  code: string;
  clientId: string;
  clientName?: string;
  vehicleId: string;
  vehicleDescription?: string;
  serviceAdvisorId: string;
  serviceAdvisorName?: string;
  operationalStatus: OperationalStatus;
  commercialStatus: CommercialStatus;
  billingStatus: BillingStatus;
  estaRetrasada: boolean;
  portalToken?: string;
  mileageIn?: number | null;
  fuelLevel?: number | null;
  failureDescription: string;
  diagnosis?: string | null;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  closedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  quotationTotal?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListWorkOrdersQuery {
  page?: number;
  limit?: number;
  operationalStatus?: OperationalStatus;
  commercialStatus?: CommercialStatus;
  serviceAdvisorId?: string;
  clientId?: string;
  vehicleId?: string;
  estaRetrasada?: boolean;
  search?: string;
}

export type WorkOrderCategory = 'taller' | 'cotizando' | 'listas';

export type OperationalBadgeType = StatusFamily;

export interface WorkOrderCardModel {
  id: string;
  folio: string;
  deadline: string;
  vehicle: string;
  plate: string;
  client: string;
  status: string;
  statusFamily: StatusFamily;
  statusType?: StatusFamily;
  category: WorkOrderCategory;
  advisor: string;
  advisorInitial: string;
  progress: number;
  isLate: boolean;
  original: WorkOrderDto;
}

export interface WorkOrdersSummaryStats {
  countTaller: number;
  countCotizando: number;
  countListas: number;
}
