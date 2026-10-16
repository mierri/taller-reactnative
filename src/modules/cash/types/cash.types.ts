import { AdvancePaymentMethod } from "@/modules/work-orders";

export type CashMovementType = "INCOME" | "EXPENSE";

export interface CashMovementItem {
  id: string;
  workOrderId?: string;
  workOrderCode: string;
  clientName: string;
  paymentMethod: AdvancePaymentMethod;
  amount: number;
  commissionAmount: number;
  netAmount: number;
  createdAt: string;
  type: CashMovementType;
}

export interface ChargeableOrderItem {
  id: string;
  folio: string;
  vehicleName: string;
  clientName: string;
  isCommercialClosed: boolean;
  pendingBalance?: number;
}

