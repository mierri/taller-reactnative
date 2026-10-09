import React from "react";
import {
  DetailPhotoItem,
  PhotoUploadPayload,
  QuotationItem,
  QuotationItemType,
} from "../../types/work-order-detail.types";
import { AddNoteSheet } from "./AddNoteSheet";
import { AddPhotoSheet } from "./AddPhotoSheet";
import { AddQuotationItemSheet } from "./AddQuotationItemSheet";
import { AdjustItemPriceModal } from "./AdjustItemPriceModal";
import { AdvanceStatusModal } from "./AdvanceStatusModal";
import { AdvanceSuccessModal } from "./AdvanceSuccessModal";
import { CloseOrderSheet } from "./CloseOrderSheet";
import { ConfirmCommercialCloseSheet } from "./ConfirmCommercialCloseSheet";
import { DeliverVehicleSheet } from "./DeliverVehicleSheet";
import { PhotoZoomModal } from "./PhotoZoomModal";
import { QualityControlSheet } from "./QualityControlSheet";
import {
  AdvancePaymentMethod,
  RegisterAdvanceSheet,
} from "./RegisterAdvanceSheet";
import { RegisterPaymentSheet } from "./RegisterPaymentSheet";
import { RejectQuotationItemSheet } from "./RejectQuotationItemSheet";
import { ShareQuotationLinkSheet } from "./ShareQuotationLinkSheet";

export interface DetailModalsContainerProps {
  orderFolio?: string;
  vehicleName?: string;

  addNoteVisible: boolean;
  onCloseAddNote: () => void;
  onSaveNote: (content: string, isClientVisible: boolean) => void;

  addPhotoVisible: boolean;
  onCloseAddPhoto: () => void;
  onPhotosSelected: (photos: PhotoUploadPayload[]) => void;

  zoomPhoto: DetailPhotoItem | null;
  onCloseZoomPhoto: () => void;

  registerAdvanceVisible: boolean;
  onCloseRegisterAdvance: () => void;
  onSaveAdvance: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent?: number,
    netAmount?: number,
    reference?: string,
  ) => void;

  advanceSuccessVisible: boolean;
  onCloseAdvanceSuccess: () => void;

  advanceStatusVisible: boolean;
  onCloseAdvanceStatus: () => void;
  onConfirmAdvanceStatus: () => void;

  addQuotationItemVisible?: boolean;
  onCloseAddQuotationItem?: () => void;
  onSaveQuotationItem?: (item: {
    type: QuotationItemType;
    concept: string;
    unitPrice: number;
    quantity: number;
  }) => void;

  adjustPriceItem?: QuotationItem | null;
  onCloseAdjustPrice?: () => void;
  onSaveAdjustPrice?: (itemId: string, quantity: number, unitPrice: number) => void;

  shareLinkVisible?: boolean;
  onCloseShareLink?: () => void;
  onCopiedShareLink?: () => void;

  rejectItemId?: string | null;
  onCloseRejectItem?: () => void;
  onConfirmRejectItem?: (itemId: string, reason: string) => void;

  qualityControlVisible?: boolean;
  onCloseQualityControl?: () => void;
  onConfirmQualityControl?: () => void;
  onReturnToRepairQualityControl?: () => void;

  deliverVehicleVisible?: boolean;
  onCloseDeliverVehicle?: () => void;
  onConfirmDeliverVehicle?: () => void;
  belongings?: { id: string; name: string }[];

  confirmCommercialCloseVisible?: boolean;
  onCloseConfirmCommercialClose?: () => void;
  onConfirmCommercialClose?: () => void;
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  total?: number;
  advanceTotal?: number;

  registerPaymentVisible?: boolean;
  onCloseRegisterPayment?: () => void;
  onSavePayment?: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent: number,
    netAmount: number,
  ) => void;
  pendingBalance?: number;

  closeOrderVisible?: boolean;
  onCloseCloseOrder?: () => void;
  onConfirmCloseOrder?: () => void;
}

export const DetailModalsContainer: React.FC<DetailModalsContainerProps> = ({
  orderFolio,
  vehicleName,
  addNoteVisible,
  onCloseAddNote,
  onSaveNote,
  addPhotoVisible,
  onCloseAddPhoto,
  onPhotosSelected,
  zoomPhoto,
  onCloseZoomPhoto,
  registerAdvanceVisible,
  onCloseRegisterAdvance,
  onSaveAdvance,
  advanceSuccessVisible,
  onCloseAdvanceSuccess,
  advanceStatusVisible,
  onCloseAdvanceStatus,
  onConfirmAdvanceStatus,
  addQuotationItemVisible = false,
  onCloseAddQuotationItem = () => {},
  onSaveQuotationItem = () => {},
  adjustPriceItem = null,
  onCloseAdjustPrice = () => {},
  onSaveAdjustPrice = () => {},
  shareLinkVisible = false,
  onCloseShareLink = () => {},
  onCopiedShareLink = () => {},
  rejectItemId = null,
  onCloseRejectItem = () => {},
  onConfirmRejectItem = () => {},
  qualityControlVisible = false,
  onCloseQualityControl = () => {},
  onConfirmQualityControl = () => {},
  onReturnToRepairQualityControl = () => {},
  deliverVehicleVisible = false,
  onCloseDeliverVehicle = () => {},
  onConfirmDeliverVehicle = () => {},
  belongings = [],
  confirmCommercialCloseVisible = false,
  onCloseConfirmCommercialClose = () => {},
  onConfirmCommercialClose = () => {},
  subtotal = 0,
  discountAmount = 0,
  taxAmount = 0,
  total = 0,
  advanceTotal = 0,
  registerPaymentVisible = false,
  onCloseRegisterPayment = () => {},
  onSavePayment = () => {},
  pendingBalance = 0,
  closeOrderVisible = false,
  onCloseCloseOrder = () => {},
  onConfirmCloseOrder = () => {},
}) => {
  return (
    <>
      <AddNoteSheet
        visible={addNoteVisible}
        onClose={onCloseAddNote}
        onSaveNote={onSaveNote}
      />

      <AddPhotoSheet
        visible={addPhotoVisible}
        onClose={onCloseAddPhoto}
        onPhotosSelected={onPhotosSelected}
      />

      <PhotoZoomModal
        visible={Boolean(zoomPhoto)}
        photo={zoomPhoto}
        onClose={onCloseZoomPhoto}
      />

      <RegisterAdvanceSheet
        visible={registerAdvanceVisible}
        onClose={onCloseRegisterAdvance}
        orderFolio={orderFolio}
        vehicleName={vehicleName}
        onSaveAdvance={onSaveAdvance}
      />

      <AdvanceSuccessModal
        visible={advanceSuccessVisible}
        onClose={onCloseAdvanceSuccess}
      />

      <AdvanceStatusModal
        visible={advanceStatusVisible}
        onClose={onCloseAdvanceStatus}
        onConfirm={onConfirmAdvanceStatus}
      />

      <AddQuotationItemSheet
        visible={addQuotationItemVisible}
        onClose={onCloseAddQuotationItem}
        onSaveItem={onSaveQuotationItem}
      />

      <AdjustItemPriceModal
        visible={Boolean(adjustPriceItem)}
        item={adjustPriceItem}
        onClose={onCloseAdjustPrice}
        onSave={onSaveAdjustPrice}
      />

      <ShareQuotationLinkSheet
        visible={shareLinkVisible}
        onClose={onCloseShareLink}
        orderFolio={orderFolio}
        onCopied={onCopiedShareLink}
      />

      <RejectQuotationItemSheet
        visible={Boolean(rejectItemId)}
        itemId={rejectItemId}
        onClose={onCloseRejectItem}
        onConfirmReject={onConfirmRejectItem}
      />

      <QualityControlSheet
        visible={qualityControlVisible}
        onClose={onCloseQualityControl}
        onConfirm={onConfirmQualityControl}
        onReturnToRepair={onReturnToRepairQualityControl}
      />

      <DeliverVehicleSheet
        visible={deliverVehicleVisible}
        onClose={onCloseDeliverVehicle}
        onConfirm={onConfirmDeliverVehicle}
        belongings={belongings}
      />

      <ConfirmCommercialCloseSheet
        visible={confirmCommercialCloseVisible}
        onClose={onCloseConfirmCommercialClose}
        onConfirm={onConfirmCommercialClose}
        subtotal={subtotal}
        discountAmount={discountAmount}
        taxAmount={taxAmount}
        total={total}
        advanceTotal={advanceTotal}
      />

      <RegisterPaymentSheet
        visible={registerPaymentVisible}
        onClose={onCloseRegisterPayment}
        orderFolio={orderFolio}
        vehicleName={vehicleName}
        pendingBalance={pendingBalance}
        onSavePayment={onSavePayment}
      />

      <CloseOrderSheet
        visible={closeOrderVisible}
        onClose={onCloseCloseOrder}
        onConfirm={onConfirmCloseOrder}
        orderFolio={orderFolio}
        vehicleName={vehicleName}
      />
    </>
  );
};
