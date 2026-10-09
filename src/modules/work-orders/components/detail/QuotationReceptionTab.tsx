import { useTheme } from "@/theme";
import { ArrowRight, ClipboardList, Plus, RotateCcw, Send } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QuotationItem } from "../../types/work-order-detail.types";
import { QuotationItemCard } from "./QuotationItemCard";
import { QuotationTotalsCard } from "./QuotationTotalsCard";

export interface QuotationReceptionTabProps {
  items: QuotationItem[];
  operationalStatus?: string;
  onOpenAddItem: () => void;
  onRemoveItem?: (id: string) => void;
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
}

export const QuotationReceptionTab: React.FC<QuotationReceptionTabProps> = ({
  items,
  operationalStatus,
  onOpenAddItem,
  onRemoveItem,
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
}) => {
  const { colors, typography, radius } = useTheme();

  const isApprovalStage = operationalStatus === "EN_ESPERA_APROBACION";
  const isRepairStage =
    operationalStatus === "EN_REPARACION" ||
    operationalStatus === "CONTROL_CALIDAD" ||
    operationalStatus === "LISTA_PARA_ENTREGA" ||
    operationalStatus === "ENTREGADA";

  const approvedCount = items.filter((i) => i.approvalStatus === "APPROVED").length;
  const hasItems = items.length > 0;
  const canStartRepair = approvedCount > 0;
  const allRejected = hasItems && items.every((i) => i.approvalStatus === "REJECTED");

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
            PRESUPUESTO
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {approvedCount} de {items.length} conceptos aprobados
          </Text>
        </View>

        {!isRepairStage && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenAddItem}
            style={styles.addConceptBtn}
          >
            <Plus size={16} color={colors.brandPrimary} strokeWidth={2.4} />
            <Text
              style={[
                typography.captionMedium,
                { color: colors.brandPrimary, fontWeight: "700" },
              ]}
            >
              Concepto
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasItems ? (
        <View
          style={[
            styles.emptyStateBox,
            {
              backgroundColor: colors.surfaceTile,
              borderColor: colors.borderDashed,
              borderRadius: radius.xl,
            },
          ]}
        >
          <ClipboardList size={38} color={colors.textSecondary} strokeWidth={1.8} />
          <Text
            style={[
              typography.headingMd,
              styles.emptyTitle,
              { color: colors.textStrong },
            ]}
          >
            El diagnóstico va primero
          </Text>
          <Text
            style={[
              typography.bodyMd,
              styles.emptyDescription,
              { color: colors.textSecondary },
            ]}
          >
            Añade los servicios y refacciones para preparar el presupuesto.
          </Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {items.map((item) => (
            <QuotationItemCard
              key={item.id}
              item={item}
              isApprovalStage={isApprovalStage}
              isRepairStage={isRepairStage}
              onAdjustPrice={onAdjustPrice}
              onApprove={onApproveItem}
              onRequestReject={onRequestRejectItem}
              onCreateNewProposal={onCreateNewProposalItem}
              onToggleExecuted={onToggleExecutedItem}
              onRemove={onRemoveItem}
            />
          ))}
        </View>
      )}

      {!isApprovalStage && !isRepairStage && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenAddItem}
          style={[
            styles.addFullButton,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Plus size={18} color={colors.brandPrimary} strokeWidth={2.4} />
          <Text
            style={[
              typography.buttonMd,
              { color: colors.brandPrimary, fontWeight: "700" },
            ]}
          >
            Agregar servicio o refacción
          </Text>
        </TouchableOpacity>
      )}

      <QuotationTotalsCard
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

      {!isApprovalStage && !isRepairStage && (
        <TouchableOpacity
          activeOpacity={hasItems ? 0.85 : 1}
          disabled={!hasItems}
          onPress={onRequestApproval}
          style={[
            styles.approvalButton,
            {
              backgroundColor: hasItems ? colors.brandPrimary : colors.borderControl,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Send size={18} color={colors.textOnBrand} strokeWidth={2.2} />
          <Text
            style={[
              typography.buttonMd,
              { color: colors.textOnBrand, fontWeight: "700" },
            ]}
          >
            Solicitar aprobación
          </Text>
        </TouchableOpacity>
      )}

      {isApprovalStage && (
        <View style={styles.approvalActionsContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onShareApprovalLink}
            style={[
              styles.shareLinkButton,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderButton,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Send size={17} color={colors.brandPrimary} strokeWidth={2.2} />
            <Text
              style={[
                typography.buttonMd,
                { color: colors.brandPrimary, fontWeight: "700" },
              ]}
            >
              Compartir enlace de aprobación
            </Text>
          </TouchableOpacity>

          {allRejected ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onResetToQuotation}
              style={[
                styles.startRepairButton,
                {
                  backgroundColor: colors.brandPrimary,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <RotateCcw size={18} color={colors.textOnBrand} strokeWidth={2.2} />
              <Text
                style={[
                  typography.buttonMd,
                  { color: colors.textOnBrand, fontWeight: "700" },
                ]}
              >
                Crear nueva propuesta
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={canStartRepair ? 0.85 : 1}
              disabled={!canStartRepair}
              onPress={onConfirmApprovalAndStart}
              style={[
                styles.startRepairButton,
                {
                  backgroundColor: canStartRepair ? colors.brandPrimary : colors.borderControl,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Text
                style={[
                  typography.buttonMd,
                  { color: colors.textOnBrand, fontWeight: "700" },
                ]}
              >
                Confirmar aprobación e iniciar
              </Text>
              <ArrowRight size={18} color={colors.textOnBrand} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    gap: 2,
  },
  addConceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  emptyStateBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  emptyDescription: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
  },
  itemsList: {
    gap: 12,
  },
  addFullButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    gap: 8,
  },
  approvalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
    marginTop: 4,
  },
  approvalActionsContainer: {
    gap: 12,
    marginTop: 4,
  },
  shareLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1,
    gap: 8,
  },
  startRepairButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
  },
});
