import { addMockCashMovement } from "@/modules/cash/mocks/cash.mock";
import {
  AccountPayableItem,
  AccountReceivableItem,
  FinancialReportSummary,
  ManualMovementItem,
  SupplierOption,
} from "../types/finance.types";

export const initialSuppliers: SupplierOption[] = [
  { id: "sup-1", name: "Refaccionaria Central", defaultConcept: "Compra de refacciones" },
  { id: "sup-2", name: "AutoPartes del Norte", defaultConcept: "Insumos y balatas" },
  { id: "sup-3", name: "Distribuidora Monterrey", defaultConcept: "Aceites y lubricantes" },
  { id: "sup-4", name: "Llantas y Rines del Centro", defaultConcept: "Llantas y vulcanizado" },
  { id: "sup-5", name: "Telmex / Internet", defaultConcept: "Internet fibra óptica taller" },
  { id: "sup-6", name: "CFE / Energía", defaultConcept: "Servicio de luz taller" },
];

let receivablesStore: AccountReceivableItem[] = [
  {
    id: "ar-1",
    workOrderId: "wo-1044",
    folio: "OT-1044",
    clientName: "Miguel Hernández",
    vehicleName: "Honda Civic",
    totalAmount: 5333.6,
    paidAmount: 2666.8,
    balance: 2666.8,
    status: "PARTIAL",
    createdAt: "10/10/2026",
  },
  {
    id: "ar-2",
    workOrderId: "wo-1040",
    folio: "OT-1040",
    clientName: "Elena Cortés",
    vehicleName: "Volkswagen Jetta",
    totalAmount: 3166.8,
    paidAmount: 0,
    balance: 3166.8,
    status: "PENDING",
    createdAt: "09/10/2026",
  },
  {
    id: "ar-3",
    workOrderId: "wo-1035",
    folio: "OT-1035",
    clientName: "Roberto Gómez",
    vehicleName: "Mazda 3",
    totalAmount: 4200.0,
    paidAmount: 4200.0,
    balance: 0,
    status: "PAID",
    createdAt: "05/10/2026",
  },
];

let payablesStore: AccountPayableItem[] = [
  {
    id: "ap-1",
    supplierId: "sup-1",
    supplierName: "Refaccionaria Central",
    concept: "Compra de filtros y lubricantes",
    totalAmount: 3300,
    paidAmount: 0,
    balance: 3300,
    status: "PENDING",
    dueDate: "2026-10-19",
    createdAt: "12/10/2026",
  },
  {
    id: "ap-2",
    supplierId: "sup-5",
    supplierName: "Telmex / Internet",
    concept: "Internet fibra óptica taller",
    totalAmount: 999,
    paidAmount: 0,
    balance: 999,
    status: "PENDING",
    dueDate: "2026-10-25",
    createdAt: "01/10/2026",
    recurrence: {
      isRecurring: true,
      frequency: "MONTHLY",
      repeatDay: "Día 25",
      summaryLabel: "Mensual · Cada día 25",
    },
  },
];

let manualMovementsStore: ManualMovementItem[] = [];

export function getMockSuppliers(): SupplierOption[] {
  return [...initialSuppliers];
}

export function getMockReceivables(includePaid: boolean = false): AccountReceivableItem[] {
  if (includePaid) {
    return [...receivablesStore];
  }
  return receivablesStore.filter((item) => item.balance > 0);
}

export function applyPaymentToReceivable(
  receivableId: string,
  amount: number,
): AccountReceivableItem | null {
  const target = receivablesStore.find((item) => item.id === receivableId);
  if (!target) return null;

  const newPaidAmount = target.paidAmount + amount;
  const newBalance = Math.max(0, target.totalAmount - newPaidAmount);
  target.paidAmount = newPaidAmount;
  target.balance = newBalance;
  target.status = newBalance === 0 ? "PAID" : "PARTIAL";

  return { ...target };
}

export function getMockPayables(): AccountPayableItem[] {
  return [...payablesStore];
}

export function addMockPayable(
  item: Omit<AccountPayableItem, "id" | "paidAmount" | "balance" | "status" | "createdAt">,
): AccountPayableItem {
  const newItem: AccountPayableItem = {
    ...item,
    id: `ap-${Date.now()}`,
    paidAmount: 0,
    balance: item.totalAmount,
    status: "PENDING",
    createdAt: new Date().toLocaleDateString("es-MX"),
  };
  payablesStore = [newItem, ...payablesStore];
  return newItem;
}

export function applyPaymentToPayable(
  payableId: string,
  amount: number,
  method: "CASH" | "TRANSFER" | "CARD" = "CASH",
): AccountPayableItem | null {
  const target = payablesStore.find((item) => item.id === payableId);
  if (!target) return null;

  const newPaidAmount = target.paidAmount + amount;
  const newBalance = Math.max(0, target.totalAmount - newPaidAmount);
  target.paidAmount = newPaidAmount;
  target.balance = newBalance;
  target.status = newBalance === 0 ? "PAID" : "PARTIAL";

  if (method === "CASH") {
    addMockCashMovement({
      workOrderCode: "CXP",
      clientName: target.supplierName,
      paymentMethod: "CASH",
      amount,
      commissionAmount: 0,
      netAmount: amount,
      type: "EXPENSE",
    });
  }

  return { ...target };
}

export function getMockManualMovements(): ManualMovementItem[] {
  return [...manualMovementsStore];
}

export function addMockManualMovement(
  item: Omit<ManualMovementItem, "id"> | (Omit<ManualMovementItem, "id" | "createdAt"> & { createdAt?: string }),
): ManualMovementItem {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const newItem: ManualMovementItem = {
    ...item,
    id: `mm-${Date.now()}`,
    createdAt: item.createdAt || `${day}/${month}/${year}`,
  };

  manualMovementsStore = [newItem, ...manualMovementsStore];

  if (item.paymentMethod === "CASH") {
    addMockCashMovement({
      workOrderCode: item.type === "INCOME" ? "INGRESO" : "GASTO",
      clientName: item.concept,
      paymentMethod: "CASH",
      amount: item.amount,
      commissionAmount: 0,
      netAmount: item.amount,
      type: item.type,
    });
  }

  return newItem;
}

export function getMockFinancialReport(
  fromDate?: Date,
  toDate?: Date,
): FinancialReportSummary {
  const defaultFrom = fromDate || new Date(2026, 9, 1);
  const defaultTo = toDate || new Date(2026, 9, 16);

  const formatStr = (d: Date) => {
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    from: formatStr(defaultFrom),
    to: formatStr(defaultTo),
    salesBeforeDiscount: 5460.0,
    discounts: 0.0,
    taxSeparate: 873.6,
    cardCommissions: 35.0,
    salesNet: 5460.0,
    netCashFlow: 1465.0,
    totalLabor: 3221.4,
    totalParts: 2238.6,
    servicesBreakdown: [
      {
        id: "srv-1",
        name: "Mantenimiento y afinación mayor",
        category: "labor",
        ordersCount: 4,
        totalAmount: 2074.8,
        percentage: 38,
        color: "#006045",
      },
      {
        id: "srv-2",
        name: "Frenos, balatas y suspensión",
        category: "labor",
        ordersCount: 3,
        totalAmount: 1583.4,
        percentage: 29,
        color: "#12805c",
      },
      {
        id: "srv-3",
        name: "Diagnóstico y escaneo electrónico",
        category: "labor",
        ordersCount: 2,
        totalAmount: 1146.6,
        percentage: 21,
        color: "#b68d4f",
      },
      {
        id: "srv-4",
        name: "Cambio de aceite y filtros",
        category: "parts",
        ordersCount: 2,
        totalAmount: 655.2,
        percentage: 12,
        color: "#5c3b88",
      },
    ],
  };
}

