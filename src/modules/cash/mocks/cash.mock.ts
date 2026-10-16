import { getMockWorkOrders } from "@/modules/work-orders/mocks/work-orders.mock";
import { OperationalStatus } from "@/modules/work-orders/types/work-order.types";
import { parseVehicleInfo } from "@/modules/work-orders/utils/detail-formatters";
import { CashMovementItem, ChargeableOrderItem } from "../types/cash.types";

let dynamicMovements: CashMovementItem[] = [];

export function getMockCashMovements(): CashMovementItem[] {
  return [...dynamicMovements];
}

export function addMockCashMovement(
  item: Omit<CashMovementItem, "id" | "createdAt">,
): CashMovementItem {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12 || 12;

  const newMovement: CashMovementItem = {
    ...item,
    id: `cm-${Date.now()}`,
    createdAt: `${day}/${month}/${year} · ${hours}:${minutes} ${period}`,
  };
  dynamicMovements = [newMovement, ...dynamicMovements];
  return newMovement;
}

export function getChargeableOrders(): ChargeableOrderItem[] {
  const { data } = getMockWorkOrders();
  return data
    .filter(
      (order) =>
        order.operationalStatus !== OperationalStatus.CERRADA &&
        order.operationalStatus !== OperationalStatus.CANCELADA,
    )
    .map((order) => {
      const { vehicleName } = parseVehicleInfo(order.vehicleDescription);
      return {
        id: order.id,
        folio: order.code,
        vehicleName,
        clientName: order.clientName || "Cliente",
        isCommercialClosed: false,
      };
    });
}

