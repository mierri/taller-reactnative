import { BillingStatus, CommercialStatus, OperationalStatus } from "./work-order.types";

export type InspectionItemStatus = "sin_problema" | "revisar" | "requiere_atencion";

export interface QuickInspectionState {
  brakes: InspectionItemStatus;
  levels: InspectionItemStatus;
  tires: InspectionItemStatus;
}

export interface DetailNoteItem {
  id: string;
  workOrderId: string;
  content: string;
  isClientVisible: boolean;
  createdAt: string;
  authorName?: string;
}

export interface DetailPhotoItem {
  id: string;
  workOrderId: string;
  url: string;
  caption?: string;
  category: "RECEPTION" | "INSPECTION" | "PROCESS" | "QUALITY_CONTROL" | "DELIVERY";
  createdAt: string;
}

export interface PhotoUploadPayload {
  uri: string;
  caption?: string;
  category?: DetailPhotoItem["category"];
}

export interface DetailPaymentItem {
  id: string;
  amount: number;
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "CHECK";
  commissionPercent?: number;
  netAmount?: number;
  reference?: string;
  createdAt: string;
}

export type OrderDetailTabKey = "bahia" | "cotizacion" | "cierre";

export interface WorkOrderDetailState {
  id: string;
  code: string;
  vehicleName: string;
  plate: string;
  clientName: string;
  serviceAdvisorName: string;
  operationalStatus: OperationalStatus;
  commercialStatus: CommercialStatus;
  billingStatus: BillingStatus;
  estaRetrasada: boolean;
  failureDescription: string;
  diagnosis: string | null;
  mileageIn: number;
  fuelLevel: number;
  estimatedDelivery: string | null;
  quickInspection: QuickInspectionState;
  notes: DetailNoteItem[];
  photos: DetailPhotoItem[];
  applyIva: boolean;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  requiresInvoice: boolean;
  advancePayments: DetailPaymentItem[];
  advanceTotal: number;
}

export type QuotationItemType = "LABOR" | "PART" | "CONSUMABLE";

export interface QuotationItem {
  id: string;
  type: QuotationItemType;
  concept: string;
  unitPrice: number;
  quantity: number;
  total: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  isExecuted?: boolean;
  isRecotized?: boolean;
}

export const initialDemoPhotos: DetailPhotoItem[] = [
  { id: "ph-1", workOrderId: "demo", url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80", caption: "Frontal y cofre", category: "RECEPTION", createdAt: new Date().toISOString() },
  { id: "ph-2", workOrderId: "demo", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80", caption: "Costado derecho", category: "RECEPTION", createdAt: new Date().toISOString() },
  { id: "ph-3", workOrderId: "demo", url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", caption: "Bahía de motor", category: "INSPECTION", createdAt: new Date().toISOString() },
];

