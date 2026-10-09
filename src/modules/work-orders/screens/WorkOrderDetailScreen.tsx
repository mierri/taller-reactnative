import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader, Banner, BannerType } from "@/components";
import { useTheme } from "@/theme";
import { fetchWorkOrderById } from "../services/work-orders.service";
import {
  DetailNoteItem, DetailPhotoItem, initialDemoPhotos,
  OrderDetailTabKey, PhotoUploadPayload, QuickInspectionState,
} from "../types/work-order-detail.types";
import { OperationalStatus, WorkOrderDto } from "../types/work-order.types";
import { calculateQuotationTotals, getNextInspectionStatus, parseVehicleInfo } from "../utils/detail-formatters";
import { DetailHeaderInfo } from "../components/detail/DetailHeaderInfo";
import { DetailModalsContainer } from "../components/detail/DetailModalsContainer";
import { DetailTabContent } from "../components/detail/DetailTabContent";
import { DetailTabNavigation } from "../components/detail/DetailTabNavigation";
import { useQuotationWorkflow } from "../hooks/useQuotationWorkflow";
import { useCommercialDeliveryWorkflow } from "../hooks/useCommercialDeliveryWorkflow";

export interface WorkOrderDetailScreenProps {
  id: string;
}

export const WorkOrderDetailScreen: React.FC<WorkOrderDetailScreenProps> = ({ id }) => {
  const { colors, layout } = useTheme();
  const [order, setOrder] = useState<WorkOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderDetailTabKey>("bahia");
  const [isLate, setIsLate] = useState(false);
  const [quickInspection, setQuickInspection] = useState<QuickInspectionState>({
    brakes: "revisar", levels: "revisar", tires: "revisar",
  });
  const [notes, setNotes] = useState<DetailNoteItem[]>([]);
  const [photos, setPhotos] = useState<DetailPhotoItem[]>(initialDemoPhotos);
  const [selectedZoomPhoto, setSelectedZoomPhoto] = useState<DetailPhotoItem | null>(null);
  const [showAddNoteSheet, setShowAddNoteSheet] = useState(false);
  const [showAddPhotoSheet, setShowAddPhotoSheet] = useState(false);
  const [showRegisterAdvanceSheet, setShowRegisterAdvanceSheet] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: BannerType } | null>(null);

  const showToast = (message: string, type: BannerType = "Success") => setToast({ message, type });

  const appendNote = (content: string) => {
    setNotes((prev) => [
      { id: `sys-note-${Date.now()}`, workOrderId: id, content, authorName: "INTERNA", isClientVisible: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const quotation = useQuotationWorkflow({ order, setOrder, showToast, setActiveTab, appendNote });
  const { subtotal, taxAmount, total } = calculateQuotationTotals(
    quotation.quotationItems, quotation.applyIva, quotation.discountType, quotation.discountValue,
  );
  const commercial = useCommercialDeliveryWorkflow({ order, setOrder, showToast, setActiveTab, appendNote, total });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const dto = await fetchWorkOrderById(id);
        if (isMounted) {
          setOrder(dto);
          setIsLate(dto.estaRetrasada);
          if (dto.operationalStatus === OperationalStatus.EN_DIAGNOSTICO) {
            setNotes((prev) => [{ id: "sys-diag-init", workOrderId: id, content: "Etapa actualizada: En diagnóstico.", authorName: "INTERNA", isClientVisible: false, createdAt: dto.updatedAt || new Date().toISOString() }, ...prev]);
          }
        }
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "No se pudo cargar la orden");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  const vehicleInfo = parseVehicleInfo(order?.vehicleDescription);

  const handleToggleLate = (val: boolean) => { setIsLate(val); showToast(val ? "Orden marcada con retraso." : "Retraso desactivado."); };
  const handleToggleInspection = (key: keyof QuickInspectionState) => setQuickInspection((p) => ({ ...p, [key]: getNextInspectionStatus(p[key]) }));
  const handleToggleAllInspection = () => setQuickInspection((p) => { const n = getNextInspectionStatus(p.brakes); return { brakes: n, levels: n, tires: n }; });
  const handleSaveNote = (content: string, isClientVisible: boolean) => {
    setNotes((p) => [{ id: `note-${Date.now()}`, workOrderId: id, content, isClientVisible, createdAt: new Date().toISOString() }, ...p]);
    showToast("Nota agregada correctamente.");
  };
  const handleAddPhotos = (payloads: PhotoUploadPayload[]) => {
    const items: DetailPhotoItem[] = payloads.map((item, idx) => ({
      id: `photo-${Date.now()}-${idx}`, workOrderId: id, url: item.uri, caption: item.caption || "Evidencia fotográfica", category: item.category || "INSPECTION", createdAt: new Date().toISOString(),
    }));
    setPhotos((p) => [...items, ...p]);
    showToast(payloads.length === 1 ? "Fotografía adjuntada." : `${payloads.length} fotografías adjuntadas.`);
  };
  const handleSaveAdvance = (amount: number, method: "CASH" | "CARD" | "TRANSFER") => commercial.handleRegisterPayment(amount, method, 0, amount);
  const handleConfirmAdvance = () => {
    if (order) { setOrder({ ...order, operationalStatus: OperationalStatus.EN_DIAGNOSTICO }); appendNote("Etapa actualizada: En diagnóstico."); showToast("La orden avanzó a En diagnóstico."); }
  };
  const handleSaveDiagnosis = (newDiag: string) => {
    if (order) { setOrder({ ...order, diagnosis: newDiag }); showToast("Diagnóstico guardado correctamente."); }
  };
  const handlePrepareQuotation = () => {
    if (!order?.diagnosis?.trim()) { showToast("Guarda el diagnóstico para continuar con la cotización.", "Warning"); return; }
    setOrder((p) => (p ? { ...p, operationalStatus: OperationalStatus.EN_ESPERA_COTIZACION } : null));
    appendNote("Etapa actualizada: Por cotizar.");
    setActiveTab("cotizacion");
    showToast("Etapa actualizada: Por cotizar.", "Success");
  };

  const isClosed = order?.operationalStatus === OperationalStatus.CERRADA;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader type="Detail" title="Orden de trabajo" />
      {toast && (
        <Banner
          type={toast.type}
          layout="Floating"
          variant="dark"
          message={toast.message}
          dismissible
          autoDismiss
          onDismiss={() => setToast(null)}
        />
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : error || !order ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.statusDangerFg }]}>{error || "Orden no encontrada"}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: layout.margin, paddingBottom: Platform.OS === "ios" ? 140 : 90 }]}
          showsVerticalScrollIndicator={false}
        >
          <DetailHeaderInfo
            folio={order.code}
            status={order.operationalStatus}
            vehicleName={vehicleInfo.vehicleName}
            plate={vehicleInfo.plate}
            clientName={order.clientName || "Cliente"}
          />

          <DetailTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <DetailTabContent
            activeTab={activeTab}
            order={order}
            quickInspection={quickInspection}
            notes={notes}
            photos={photos}
            isLate={isLate}
            onToggleLate={handleToggleLate}
            onToggleInspectionItem={handleToggleInspection}
            onToggleAllInspection={handleToggleAllInspection}
            onOpenAddNote={() => setShowAddNoteSheet(true)}
            onOpenAddPhoto={() => setShowAddPhotoSheet(true)}
            onSelectPhoto={setSelectedZoomPhoto}
            onSaveDiagnosis={handleSaveDiagnosis}
            onAdvanceToDiagnosis={() => setShowAdvanceModal(true)}
            onPrepareQuotation={handlePrepareQuotation}
            onSwitchTab={setActiveTab}
            onAdvanceToQualityControl={quotation.handleAdvanceToQualityControl}
            onAdvanceToReadyForDelivery={quotation.handleAdvanceToReadyForDelivery}
            onRegisterDelivery={() => commercial.setShowDeliverVehicleSheet(true)}
            onCloseOrder={commercial.handleAttemptCloseOrder}
            onWarrantyReentry={commercial.handleWarrantyReentry}
            quotationItems={quotation.quotationItems}
            onOpenAddQuotationItem={() => quotation.setShowAddQuotationItemSheet(true)}
            onRemoveQuotationItem={quotation.handleRemoveQuotationItem}
            onAdjustPrice={quotation.handleAdjustPrice}
            onApproveItem={quotation.handleApproveItem}
            onRequestRejectItem={quotation.handleRequestRejectItem}
            onCreateNewProposalItem={quotation.handleCreateNewProposalItem}
            onToggleExecutedItem={quotation.handleToggleExecutedItem}
            onRequestApproval={quotation.handleRequestApproval}
            onShareApprovalLink={() => quotation.setShowShareLinkSheet(true)}
            onConfirmApprovalAndStart={quotation.handleConfirmApprovalAndStart}
            onResetToQuotation={quotation.handleResetToQuotation}
            applyIva={quotation.applyIva}
            onToggleIva={quotation.setApplyIva}
            discountType={quotation.discountType}
            discountValue={quotation.discountValue}
            onDiscountTypePress={() => quotation.setDiscountType((prev) => (prev === "PERCENT" ? "FIXED" : "PERCENT"))}
            onChangeDiscountValue={quotation.setDiscountValue}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
            discountAmount={quotation.discountValue}
            requiresInvoice={quotation.requiresInvoice}
            onToggleRequiresInvoice={quotation.setRequiresInvoice}
            advanceTotal={commercial.advanceTotal}
            onOpenRegisterAdvance={() => setShowRegisterAdvanceSheet(true)}
            isCommercialClosed={commercial.isCommercialClosed}
            onOpenConfirmCommercialClose={() => commercial.setShowConfirmCommercialCloseSheet(true)}
            isCommercialCloseEnabled={commercial.isCommercialCloseEnabled}
            onOpenRegisterPayment={() => commercial.setShowRegisterPaymentSheet(true)}
            payments={commercial.payments}
            isOrderClosed={isClosed}
          />
        </ScrollView>
      )}

      <DetailModalsContainer
        orderFolio={order?.code}
        vehicleName={vehicleInfo.vehicleName}
        addNoteVisible={showAddNoteSheet}
        onCloseAddNote={() => setShowAddNoteSheet(false)}
        onSaveNote={handleSaveNote}
        addPhotoVisible={showAddPhotoSheet}
        onCloseAddPhoto={() => setShowAddPhotoSheet(false)}
        onPhotosSelected={handleAddPhotos}
        zoomPhoto={selectedZoomPhoto}
        onCloseZoomPhoto={() => setSelectedZoomPhoto(null)}
        registerAdvanceVisible={showRegisterAdvanceSheet}
        onCloseRegisterAdvance={() => setShowRegisterAdvanceSheet(false)}
        onSaveAdvance={handleSaveAdvance}
        advanceSuccessVisible={commercial.showPaymentSuccessModal}
        onCloseAdvanceSuccess={() => commercial.setShowPaymentSuccessModal(false)}
        advanceStatusVisible={showAdvanceModal}
        onCloseAdvanceStatus={() => setShowAdvanceModal(false)}
        onConfirmAdvanceStatus={handleConfirmAdvance}
        addQuotationItemVisible={quotation.showAddQuotationItemSheet}
        onCloseAddQuotationItem={() => quotation.setShowAddQuotationItemSheet(false)}
        onSaveQuotationItem={quotation.handleAddQuotationItem}
        adjustPriceItem={quotation.adjustPriceItem}
        onCloseAdjustPrice={() => quotation.setAdjustPriceItem(null)}
        onSaveAdjustPrice={quotation.handleSaveAdjustPrice}
        shareLinkVisible={quotation.showShareLinkSheet}
        onCloseShareLink={() => quotation.setShowShareLinkSheet(false)}
        onCopiedShareLink={() => showToast("Enlace copiado al portapapeles.", "Success")}
        rejectItemId={quotation.rejectTargetItemId}
        onCloseRejectItem={() => quotation.setRejectTargetItemId(null)}
        onConfirmRejectItem={quotation.handleConfirmReject}
        qualityControlVisible={quotation.showQualityControlSheet}
        onCloseQualityControl={() => quotation.setShowQualityControlSheet(false)}
        onConfirmQualityControl={quotation.handleConfirmQualityControl}
        onReturnToRepairQualityControl={quotation.handleReturnToRepair}
        deliverVehicleVisible={commercial.showDeliverVehicleSheet}
        onCloseDeliverVehicle={() => commercial.setShowDeliverVehicleSheet(false)}
        onConfirmDeliverVehicle={commercial.handleConfirmDelivery}
        belongings={commercial.belongings}
        confirmCommercialCloseVisible={commercial.showConfirmCommercialCloseSheet}
        onCloseConfirmCommercialClose={() => commercial.setShowConfirmCommercialCloseSheet(false)}
        onConfirmCommercialClose={commercial.handleConfirmCommercialClose}
        subtotal={subtotal}
        discountAmount={quotation.discountValue}
        taxAmount={taxAmount}
        total={total}
        advanceTotal={commercial.advanceTotal}
        registerPaymentVisible={commercial.showRegisterPaymentSheet}
        onCloseRegisterPayment={() => commercial.setShowRegisterPaymentSheet(false)}
        onSavePayment={commercial.handleRegisterPayment}
        pendingBalance={commercial.pendingBalance}
        closeOrderVisible={commercial.showCloseOrderSheet}
        onCloseCloseOrder={() => commercial.setShowCloseOrderSheet(false)}
        onConfirmCloseOrder={commercial.handleConfirmCloseOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { textAlign: "center", fontSize: 14 },
  scrollContent: { paddingTop: 8 },
});
