import React from "react";
import {
  DetailNoteItem,
  DetailPaymentItem,
  DetailPhotoItem,
  OrderDetailTabKey,
  QuickInspectionState,
  QuotationItem,
} from "../../types/work-order-detail.types";
import { WorkOrderDto } from "../../types/work-order.types";
import { BayReceptionTab } from "./BayReceptionTab";
import { CommercialCloseReceptionTab } from "./CommercialCloseReceptionTab";
import { QuotationReceptionTab } from "./QuotationReceptionTab";

export interface DetailTabContentProps {
  activeTab: OrderDetailTabKey;
  order: WorkOrderDto;
  quickInspection: QuickInspectionState;
  notes: DetailNoteItem[];
  photos: DetailPhotoItem[];
  isLate: boolean;
  onToggleLate: (val: boolean) => void;
  onToggleInspectionItem: (key: keyof QuickInspectionState) => void;
  onToggleAllInspection?: () => void;
  onOpenAddNote: () => void;
  onOpenAddPhoto: () => void;
  onSelectPhoto: (photo: DetailPhotoItem) => void;
  onSaveDiagnosis?: (text: string) => void;
  onAdvanceToDiagnosis: () => void;
  onPrepareQuotation?: () => void;
  onSwitchTab?: (tab: OrderDetailTabKey) => void;
  onAdvanceToQualityControl?: () => void;
  onAdvanceToReadyForDelivery?: () => void;
  onRegisterDelivery?: () => void;
  onCloseOrder?: () => void;
  onWarrantyReentry?: () => void;

  quotationItems: QuotationItem[];
  onOpenAddQuotationItem: () => void;
  onRemoveQuotationItem?: (id: string) => void;
  onAdjustPrice?: (item: QuotationItem) => void;
  onApproveItem?: (id: string) => void;
  onRequestRejectItem?: (id: string) => void;
  onCreateNewProposalItem?: (id: string) => void;
  onToggleExecutedItem?: (id: string) => void;
  onRequestApproval?: () => void;
  onShareApprovalLink?: () => void;
  onConfirmApprovalAndStart?: () => void;
  onResetToQuotation?: () => void;

  applyIva: boolean;
  onToggleIva: (val: boolean) => void;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  onDiscountTypePress: () => void;
  onChangeDiscountValue: (val: number) => void;
  subtotal: number;
  taxAmount: number;
  total: number;
  discountAmount?: number;

  requiresInvoice: boolean;
  onToggleRequiresInvoice: (val: boolean) => void;
  advanceTotal: number;
  onOpenRegisterAdvance: () => void;

  isCommercialClosed?: boolean;
  onOpenConfirmCommercialClose?: () => void;
  isCommercialCloseEnabled?: boolean;
  onOpenRegisterPayment?: () => void;
  payments?: DetailPaymentItem[];
  isOrderClosed?: boolean;
}

export const DetailTabContent: React.FC<DetailTabContentProps> = ({
  activeTab,
  order,
  quickInspection,
  notes,
  photos,
  isLate,
  onToggleLate,
  onToggleInspectionItem,
  onToggleAllInspection,
  onOpenAddNote,
  onOpenAddPhoto,
  onSelectPhoto,
  onSaveDiagnosis,
  onAdvanceToDiagnosis,
  onPrepareQuotation,
  onSwitchTab,
  onAdvanceToQualityControl,
  onAdvanceToReadyForDelivery,
  onRegisterDelivery,
  onCloseOrder,
  onWarrantyReentry,
  quotationItems,
  onOpenAddQuotationItem,
  onRemoveQuotationItem,
  onAdjustPrice,
  onApproveItem,
  onRequestRejectItem,
  onCreateNewProposalItem,
  onToggleExecutedItem,
  onRequestApproval,
  onShareApprovalLink,
  onConfirmApprovalAndStart,
  onResetToQuotation,
  applyIva,
  onToggleIva,
  discountType,
  discountValue,
  onDiscountTypePress,
  onChangeDiscountValue,
  subtotal,
  taxAmount,
  total,
  discountAmount = 0,
  requiresInvoice,
  onToggleRequiresInvoice,
  advanceTotal,
  onOpenRegisterAdvance,
  isCommercialClosed = false,
  onOpenConfirmCommercialClose = () => {},
  isCommercialCloseEnabled = false,
  onOpenRegisterPayment = () => {},
  payments = [],
  isOrderClosed = false,
}) => {
  if (activeTab === "bahia") {
    return (
      <BayReceptionTab
        failureDescription={order.failureDescription}
        mileageIn={order.mileageIn ?? 0}
        fuelLevel={order.fuelLevel ?? 0}
        estimatedDelivery={order.estimatedDelivery ?? null}
        diagnosis={order.diagnosis}
        operationalStatus={order.operationalStatus}
        quickInspection={quickInspection}
        notes={notes}
        photos={photos}
        isLate={isLate}
        onToggleLate={onToggleLate}
        onToggleInspectionItem={onToggleInspectionItem}
        onToggleAllInspection={onToggleAllInspection}
        onOpenAddNote={onOpenAddNote}
        onOpenAddPhoto={onOpenAddPhoto}
        onSelectPhoto={onSelectPhoto}
        onSaveDiagnosis={onSaveDiagnosis}
        onAdvanceToDiagnosis={onAdvanceToDiagnosis}
        onPrepareQuotation={onPrepareQuotation}
        onSwitchTab={onSwitchTab}
        onAdvanceToQualityControl={onAdvanceToQualityControl}
        onAdvanceToReadyForDelivery={onAdvanceToReadyForDelivery}
        onRegisterDelivery={onRegisterDelivery}
        onCloseOrder={onCloseOrder}
        onWarrantyReentry={onWarrantyReentry}
      />
    );
  }

  if (activeTab === "cotizacion") {
    return (
      <QuotationReceptionTab
        items={quotationItems}
        operationalStatus={order.operationalStatus}
        onOpenAddItem={onOpenAddQuotationItem}
        onRemoveItem={onRemoveQuotationItem}
        onAdjustPrice={onAdjustPrice}
        onApproveItem={onApproveItem}
        onRequestRejectItem={onRequestRejectItem}
        onCreateNewProposalItem={onCreateNewProposalItem}
        onToggleExecutedItem={onToggleExecutedItem}
        onRequestApproval={onRequestApproval}
        onShareApprovalLink={onShareApprovalLink}
        onConfirmApprovalAndStart={onConfirmApprovalAndStart}
        onResetToQuotation={onResetToQuotation}
        applyIva={applyIva}
        onToggleIva={onToggleIva}
        discountType={discountType}
        discountValue={discountValue}
        onDiscountTypePress={onDiscountTypePress}
        onChangeDiscountValue={onChangeDiscountValue}
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
      />
    );
  }

  return (
    <CommercialCloseReceptionTab
      subtotal={subtotal}
      discountAmount={discountAmount}
      taxAmount={taxAmount}
      total={total}
      requiresInvoice={requiresInvoice}
      onToggleRequiresInvoice={onToggleRequiresInvoice}
      advanceTotal={advanceTotal}
      onOpenRegisterAdvance={onOpenRegisterAdvance}
      isCommercialClosed={isCommercialClosed}
      onOpenConfirmCommercialClose={onOpenConfirmCommercialClose}
      isCommercialCloseEnabled={isCommercialCloseEnabled}
      onOpenRegisterPayment={onOpenRegisterPayment}
      payments={payments}
      isOrderClosed={isOrderClosed}
    />
  );
};
