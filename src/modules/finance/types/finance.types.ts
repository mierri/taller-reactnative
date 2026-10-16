export type FinanceTabKey = "receivables" | "payables" | "movements" | "report";

export type ReceivableItemStatus = "PENDING" | "PARTIAL" | "PAID";

export interface AccountReceivableItem {
  id: string;
  workOrderId: string;
  folio: string;
  clientName: string;
  vehicleName: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: ReceivableItemStatus;
  dueDate?: string;
  createdAt: string;
}

export type PayableItemStatus = "PENDING" | "PARTIAL" | "PAID";

export type RecurrenceFrequency =
  | "NONE"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "CUSTOM";

export interface RecurrenceConfig {
  isRecurring: boolean;
  frequency: RecurrenceFrequency;
  repeatDay?: string;
  summaryLabel?: string;
}

export interface AccountPayableItem {
  id: string;
  supplierId: string;
  supplierName: string;
  concept: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: PayableItemStatus;
  dueDate: string;
  createdAt: string;
  recurrence?: RecurrenceConfig;
}

export type ManualMovementKind = "INCOME" | "EXPENSE";

export type ManualMovementMethod = "CASH" | "CARD" | "TRANSFER";

export interface ManualMovementItem {
  id: string;
  type: ManualMovementKind;
  concept: string;
  amount: number;
  paymentMethod: ManualMovementMethod;
  createdAt: string;
}

export interface SupplierOption {
  id: string;
  name: string;
  defaultConcept?: string;
}

export interface ServiceBreakdownItem {
  id: string;
  name: string;
  category: "labor" | "parts";
  ordersCount: number;
  totalAmount: number;
  percentage: number;
  color: string;
}

export interface FinancialReportSummary {
  from: string;
  to: string;
  salesBeforeDiscount: number;
  discounts: number;
  taxSeparate: number;
  cardCommissions: number;
  salesNet: number;
  netCashFlow: number;
  totalLabor: number;
  totalParts: number;
  servicesBreakdown: ServiceBreakdownItem[];
}

