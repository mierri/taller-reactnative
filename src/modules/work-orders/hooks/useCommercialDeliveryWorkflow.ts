import { useState } from "react";
import { BannerType } from "@/components";
import {
  DetailPaymentItem,
  OrderDetailTabKey,
} from "../types/work-order-detail.types";
import { OperationalStatus, WorkOrderDto } from "../types/work-order.types";
import { AdvancePaymentMethod } from "../components/detail/RegisterAdvanceSheet";
import { formatCurrency } from "../utils/detail-formatters";

export interface UseCommercialDeliveryWorkflowProps {
  order: WorkOrderDto | null;
  setOrder: React.Dispatch<React.SetStateAction<WorkOrderDto | null>>;
  showToast: (message: string, type?: BannerType) => void;
  setActiveTab: (tab: OrderDetailTabKey) => void;
  appendNote: (content: string) => void;
  total: number;
}

export function useCommercialDeliveryWorkflow({
  order,
  setOrder,
  showToast,
  setActiveTab,
  appendNote,
  total,
}: UseCommercialDeliveryWorkflowProps) {
  const [belongings] = useState([
    { id: "1", name: "Llaves" },
    { id: "2", name: "Refacción" },
    { id: "3", name: "Gato" },
  ]);

  const [isCommercialClosed, setIsCommercialClosed] = useState(false);
  const [payments, setPayments] = useState<DetailPaymentItem[]>([
    {
      id: "pay-init-1",
      amount: 1000,
      paymentMethod: "CASH",
      netAmount: 1000,
      createdAt: "6/10/2026",
    },
  ]);

  const [showDeliverVehicleSheet, setShowDeliverVehicleSheet] = useState(false);
  const [showConfirmCommercialCloseSheet, setShowConfirmCommercialCloseSheet] =
    useState(false);
  const [showRegisterPaymentSheet, setShowRegisterPaymentSheet] =
    useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showCloseOrderSheet, setShowCloseOrderSheet] = useState(false);

  const advanceTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingBalance = Math.max(0, total - advanceTotal);
  const isLiquidated = isCommercialClosed && pendingBalance <= 0;

  const isCommercialCloseEnabled =
    order?.operationalStatus === OperationalStatus.LISTA_PARA_ENTREGA ||
    order?.operationalStatus === OperationalStatus.ENTREGADA ||
    order?.operationalStatus === OperationalStatus.CERRADA;

  const handleConfirmDelivery = () => {
    setOrder((prev) =>
      prev
        ? { ...prev, operationalStatus: OperationalStatus.ENTREGADA }
        : null,
    );
    appendNote("Vehículo entregado al cliente con pertenencias.");
    setShowDeliverVehicleSheet(false);
    showToast("Vehículo entregado con éxito.", "Success");
  };

  const handleConfirmCommercialClose = () => {
    setIsCommercialClosed(true);
    appendNote("Cierre comercial confirmado y total congelado.");
    setShowConfirmCommercialCloseSheet(false);
    showToast("Cierre comercial confirmado.", "Success");
  };

  const handleRegisterPayment = (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent: number,
    netAmount: number,
  ) => {
    const newPayment: DetailPaymentItem = {
      id: `pay-${Date.now()}`,
      amount,
      paymentMethod: method,
      createdAt: new Date().toLocaleDateString("es-MX"),
    };
    setPayments((prev) => [newPayment, ...prev]);
    appendNote(`Cobro registrado: ${formatCurrency(amount)} MXN (${method}).`);
    setShowRegisterPaymentSheet(false);
    setShowPaymentSuccessModal(true);
  };

  const handleWarrantyReentry = () => {
    setOrder((prev) =>
      prev
        ? { ...prev, operationalStatus: OperationalStatus.EN_DIAGNOSTICO }
        : null,
    );
    appendNote("Reingreso por garantía registrado. Orden devuelta a diagnóstico.");
    setActiveTab("bahia");
    showToast("Reingreso por garantía. Orden devuelta a diagnóstico.", "Warning");
  };

  const handleAttemptCloseOrder = () => {
    if (!isCommercialClosed || pendingBalance > 0) {
      showToast(
        "Debes confirmar el cierre comercial y liquidar el saldo total para cerrar la orden.",
        "Warning",
      );
      return;
    }
    setShowCloseOrderSheet(true);
  };

  const handleConfirmCloseOrder = () => {
    setOrder((prev) =>
      prev
        ? { ...prev, operationalStatus: OperationalStatus.CERRADA }
        : null,
    );
    appendNote("Orden de trabajo cerrada y liquidada definitivamente.");
    setShowCloseOrderSheet(false);
    showToast("Orden cerrada exitosamente.", "Success");
  };

  return {
    belongings,
    isCommercialClosed,
    payments,
    advanceTotal,
    pendingBalance,
    isLiquidated,
    isCommercialCloseEnabled,
    showDeliverVehicleSheet,
    setShowDeliverVehicleSheet,
    showConfirmCommercialCloseSheet,
    setShowConfirmCommercialCloseSheet,
    showRegisterPaymentSheet,
    setShowRegisterPaymentSheet,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    showCloseOrderSheet,
    setShowCloseOrderSheet,
    handleConfirmDelivery,
    handleConfirmCommercialClose,
    handleRegisterPayment,
    handleWarrantyReentry,
    handleAttemptCloseOrder,
    handleConfirmCloseOrder,
  };
}

