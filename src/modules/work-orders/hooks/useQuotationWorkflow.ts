import { useState } from "react";
import { BannerType } from "@/components";
import {
  OrderDetailTabKey,
  QuotationItem,
  QuotationItemType,
} from "../types/work-order-detail.types";
import { OperationalStatus, WorkOrderDto } from "../types/work-order.types";

export interface UseQuotationWorkflowProps {
  order: WorkOrderDto | null;
  setOrder: React.Dispatch<React.SetStateAction<WorkOrderDto | null>>;
  showToast: (message: string, type?: BannerType) => void;
  setActiveTab: (tab: OrderDetailTabKey) => void;
  appendNote: (content: string) => void;
}

export function useQuotationWorkflow({
  order,
  setOrder,
  showToast,
  setActiveTab,
  appendNote,
}: UseQuotationWorkflowProps) {
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    {
      id: "item-init-1",
      type: "LABOR",
      concept: "Cambio de aceite",
      unitPrice: 2000,
      quantity: 1,
      total: 2000,
      approvalStatus: "PENDING",
      isExecuted: false,
    },
  ]);
  const [applyIva, setApplyIva] = useState(true);
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState(0);
  const [requiresInvoice, setRequiresInvoice] = useState(false);

  const [adjustPriceItem, setAdjustPriceItem] = useState<QuotationItem | null>(null);
  const [showShareLinkSheet, setShowShareLinkSheet] = useState(false);
  const [rejectTargetItemId, setRejectTargetItemId] = useState<string | null>(null);
  const [showAddQuotationItemSheet, setShowAddQuotationItemSheet] = useState(false);
  const [showQualityControlSheet, setShowQualityControlSheet] = useState(false);

  const handleAddQuotationItem = (item: {
    type: QuotationItemType;
    concept: string;
    unitPrice: number;
    quantity: number;
  }) => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      type: item.type,
      concept: item.concept,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      total: item.unitPrice * item.quantity,
      approvalStatus: "PENDING",
      isExecuted: false,
    };
    setQuotationItems((prev) => [...prev, newItem]);
    setShowAddQuotationItemSheet(false);
    showToast("Concepto agregado al presupuesto.", "Success");
  };

  const handleRemoveQuotationItem = (itemId: string) => {
    setQuotationItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast("Concepto eliminado.", "Info");
  };

  const handleAdjustPrice = (item: QuotationItem) => {
    setAdjustPriceItem(item);
  };

  const handleSaveAdjustPrice = (itemId: string, quantity: number, unitPrice: number) => {
    setQuotationItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, quantity, unitPrice, total: quantity * unitPrice }
          : i,
      ),
    );
    showToast("Precio ajustado correctamente.", "Success");
  };

  const handleApproveItem = (itemId: string) => {
    setQuotationItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, approvalStatus: "APPROVED", rejectionReason: undefined }
          : i,
      ),
    );
    showToast("Concepto aprobado.", "Success");
  };

  const handleRequestRejectItem = (itemId: string) => {
    setRejectTargetItemId(itemId);
  };

  const handleConfirmReject = (itemId: string, reason: string) => {
    setQuotationItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, approvalStatus: "REJECTED", rejectionReason: reason }
          : i,
      ),
    );
    setRejectTargetItemId(null);
    showToast("Concepto rechazado.", "Info");
  };

  const handleToggleExecutedItem = (itemId: string) => {
    setQuotationItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, isExecuted: !i.isExecuted } : i,
      ),
    );
  };

  const handleCreateNewProposalItem = (itemId: string) => {
    const target = quotationItems.find((i) => i.id === itemId);
    if (!target) return;

    const newConcept = target.concept.includes("· Nueva propuesta")
      ? target.concept
      : `${target.concept} · Nueva propuesta`;

    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      type: target.type,
      concept: newConcept,
      unitPrice: target.unitPrice,
      quantity: target.quantity,
      total: target.total,
      approvalStatus: "PENDING",
      isExecuted: false,
      isRecotized: true,
    };

    setQuotationItems((prev) => [...prev, newItem]);
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.EN_ESPERA_COTIZACION } : null,
    );
    appendNote("Etapa actualizada: Por cotizar (Nueva propuesta).");
    setActiveTab("cotizacion");
    showToast("Nueva propuesta generada. Etapa: Por cotizar.", "Success");
  };

  const handleResetToQuotation = () => {
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.EN_ESPERA_COTIZACION } : null,
    );
    appendNote("Etapa actualizada: Por cotizar.");
    setActiveTab("cotizacion");
    showToast("Etapa actualizada: Por cotizar. Lista para nueva propuesta.", "Success");
  };

  const handleRequestApproval = () => {
    if (quotationItems.length === 0) {
      showToast("Añade al menos un concepto para solicitar aprobación.", "Warning");
      return;
    }
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.EN_ESPERA_APROBACION } : null,
    );
    appendNote("Etapa actualizada: Por aprobar.");
    showToast("Cotización lista para enviar al cliente.", "Success");
  };

  const handleConfirmApprovalAndStart = () => {
    const hasApproved = quotationItems.some((i) => i.approvalStatus === "APPROVED");
    if (!hasApproved) {
      showToast("Se requiere al menos un concepto aprobado para iniciar.", "Warning");
      return;
    }
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.EN_REPARACION } : null,
    );
    appendNote("Etapa actualizada: En reparación.");
    setActiveTab("bahia");
    showToast("Cotización confirmada. Orden en reparación.", "Success");
  };

  const handleAdvanceToQualityControl = () => {
    const approvedItems = quotationItems.filter((i) => i.approvalStatus === "APPROVED");
    const hasIncomplete = approvedItems.some((i) => !i.isExecuted);
    if (approvedItems.length === 0 || hasIncomplete) {
      showToast(
        "Faltan trabajos por ejecutar. Marca todas las tareas aprobadas como completadas para avanzar a control de calidad.",
        "Warning",
      );
      return;
    }
    setShowQualityControlSheet(true);
  };

  const handleConfirmQualityControl = () => {
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.LISTA_PARA_ENTREGA } : null,
    );
    appendNote("Control de calidad aprobado. Vehículo listo para entrega.");
    setShowQualityControlSheet(false);
    showToast("Control de calidad aprobado. Vehículo listo para entrega.", "Success");
  };

  const handleReturnToRepair = () => {
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.EN_REPARACION } : null,
    );
    appendNote("Orden devuelta a reparación desde control de calidad.");
    setShowQualityControlSheet(false);
    showToast("Orden en reparación.", "Info");
  };

  const handleAdvanceToReadyForDelivery = () => {
    setOrder((prev) =>
      prev ? { ...prev, operationalStatus: OperationalStatus.LISTA_PARA_ENTREGA } : null,
    );
    appendNote("Etapa actualizada: Lista para entrega.");
    showToast("Vehículo listo para entrega.", "Success");
  };

  return {
    quotationItems,
    applyIva,
    setApplyIva,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    requiresInvoice,
    setRequiresInvoice,
    adjustPriceItem,
    setAdjustPriceItem,
    showShareLinkSheet,
    setShowShareLinkSheet,
    rejectTargetItemId,
    setRejectTargetItemId,
    showAddQuotationItemSheet,
    setShowAddQuotationItemSheet,
    showQualityControlSheet,
    setShowQualityControlSheet,
    handleAddQuotationItem,
    handleRemoveQuotationItem,
    handleAdjustPrice,
    handleSaveAdjustPrice,
    handleApproveItem,
    handleRequestRejectItem,
    handleConfirmReject,
    handleToggleExecutedItem,
    handleCreateNewProposalItem,
    handleResetToQuotation,
    handleRequestApproval,
    handleConfirmApprovalAndStart,
    handleAdvanceToQualityControl,
    handleConfirmQualityControl,
    handleReturnToRepair,
    handleAdvanceToReadyForDelivery,
  };
}
