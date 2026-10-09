import { useTheme } from "@/theme";
import { Check, Trash2, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QuotationItem } from "../../types/work-order-detail.types";
import { formatCurrency } from "../../utils/detail-formatters";

export interface QuotationItemCardProps {
  item: QuotationItem;
  isApprovalStage: boolean;
  isRepairStage?: boolean;
  onAdjustPrice?: (item: QuotationItem) => void;
  onApprove?: (id: string) => void;
  onRequestReject?: (id: string) => void;
  onCreateNewProposal?: (id: string) => void;
  onToggleExecuted?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const QuotationItemCard: React.FC<QuotationItemCardProps> = ({
  item,
  isApprovalStage,
  isRepairStage = false,
  onAdjustPrice,
  onApprove,
  onRequestReject,
  onCreateNewProposal,
  onToggleExecuted,
  onRemove,
}) => {
  const { colors, typography, radius } = useTheme();

  const getEyebrow = () => {
    let base = "MANO DE OBRA";
    if (item.type === "PART") base = "REFACCIÓN";
    if (item.type === "CONSUMABLE") base = "CONSUMIBLE";
    if (item.isRecotized) return `${base} · RECOTIZADA`;
    return base;
  };

  const isApproved = item.approvalStatus === "APPROVED";
  const isRejected = item.approvalStatus === "REJECTED";
  const isDecided = isApproved || isRejected;

  const pillBg = isApproved
    ? colors.statusActiveBg
    : isRejected
      ? colors.statusDangerBg
      : colors.statusWarningBg;

  const pillFg = isApproved
    ? colors.statusActiveFg
    : isRejected
      ? colors.statusDangerFg
      : colors.statusWarningFg;

  const pillBorder = isApproved
    ? colors.statusActiveBorder
    : isRejected
      ? colors.statusDangerBorder
      : colors.statusWarningBorder;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
          {getEyebrow()}
        </Text>

        <View style={styles.topRightActions}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: pillBg,
                borderColor: pillBorder,
                borderRadius: radius.full,
              },
            ]}
          >
            <Text
              style={[
                typography.captionMedium,
                styles.statusPillText,
                { color: pillFg },
              ]}
            >
              {isApproved
                ? "Aprobada"
                : isRejected
                  ? "Rechazada"
                  : "Por aprobar"}
            </Text>
          </View>

          {!isApprovalStage && !isRepairStage && onRemove && (
            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text
        style={[
          typography.titleCard,
          styles.conceptTitle,
          { color: colors.textStrong },
        ]}
      >
        {item.concept}
      </Text>

      <View style={styles.priceRow}>
        <Text
          style={[typography.captionMedium, { color: colors.textSecondary }]}
        >
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </Text>
        <Text
          style={[
            typography.titleCard,
            styles.totalText,
            { color: colors.textStrong },
          ]}
        >
          {formatCurrency(item.total)}
        </Text>
      </View>

      {isRejected && (
        <View style={styles.rejectionSection}>
          <View
            style={[
              styles.rejectionReasonBox,
              {
                backgroundColor: colors.statusDangerBg,
                borderColor: colors.statusDangerBorder,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: colors.statusDangerFg, fontWeight: "600" },
              ]}
            >
              {item.rejectionReason || "Presupuesto alto"} · Conservada en el historial
            </Text>
          </View>

          {onCreateNewProposal && (
            <TouchableOpacity
              onPress={() => onCreateNewProposal(item.id)}
              style={styles.newProposalLink}
            >
              <Text
                style={[
                  typography.captionMedium,
                  { color: colors.brandPrimary, fontWeight: "700" },
                ]}
              >
                Crear nueva propuesta
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isRepairStage && isApproved && (
        <>
          <View
            style={[styles.divider, { backgroundColor: colors.borderDivider }]}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggleExecuted?.(item.id)}
            style={styles.executedRow}
          >
            <View
              style={[
                styles.checkboxBox,
                {
                  backgroundColor: item.isExecuted
                    ? colors.brandPrimary
                    : colors.surfaceCard,
                  borderColor: item.isExecuted
                    ? colors.brandPrimary
                    : colors.borderControl,
                  borderRadius: radius.xs,
                },
              ]}
            >
              {item.isExecuted && (
                <Check
                  size={13}
                  color={colors.textOnBrand}
                  strokeWidth={2.8}
                />
              )}
            </View>
            <Text
              style={[
                typography.bodyMd,
                styles.executedLabel,
                {
                  color: item.isExecuted
                    ? colors.textStrong
                    : colors.textSecondary,
                  fontWeight: item.isExecuted ? "700" : "500",
                },
              ]}
            >
              Trabajo ejecutado
            </Text>
          </TouchableOpacity>
        </>
      )}

      {onAdjustPrice && !isDecided && !isRepairStage && (
        <TouchableOpacity
          onPress={() => onAdjustPrice(item)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text
            style={[
              typography.captionMedium,
              { color: colors.brandPrimary, fontWeight: "600" },
            ]}
          >
            Ajustar precio
          </Text>
        </TouchableOpacity>
      )}

      {isApprovalStage && (
        <>
          <View
            style={[styles.divider, { backgroundColor: colors.borderDivider }]}
          />
          <View style={styles.approvalButtonsRow}>
            <TouchableOpacity
              activeOpacity={isDecided ? 1 : 0.8}
              disabled={isDecided}
              onPress={() => onApprove?.(item.id)}
              style={[
                styles.decisionBtn,
                {
                  backgroundColor: isApproved
                    ? colors.statusActiveBg
                    : isRejected
                      ? colors.surfaceTile
                      : colors.statusActiveBg,
                  borderColor: isApproved
                    ? colors.statusActiveBorder
                    : isRejected
                      ? colors.borderDivider
                      : colors.statusActiveBorder,
                  borderRadius: radius.lg,
                  opacity: isRejected ? 0.45 : 1,
                },
              ]}
            >
              <Check
                size={16}
                color={
                  isRejected ? colors.textMuted : colors.statusActiveFg
                }
                strokeWidth={2.4}
              />
              <Text
                style={[
                  typography.captionMedium,
                  styles.decisionBtnText,
                  {
                    color: isRejected
                      ? colors.textMuted
                      : colors.statusActiveFg,
                  },
                ]}
              >
                Aprobar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={isDecided ? 1 : 0.8}
              disabled={isDecided}
              onPress={() => onRequestReject?.(item.id)}
              style={[
                styles.decisionBtn,
                {
                  backgroundColor: isRejected
                    ? colors.statusDangerBg
                    : isApproved
                      ? colors.surfaceTile
                      : colors.statusDangerBg,
                  borderColor: isRejected
                    ? colors.statusDangerBorder
                    : isApproved
                      ? colors.borderDivider
                      : colors.statusDangerBorder,
                  borderRadius: radius.lg,
                  opacity: isApproved ? 0.45 : 1,
                },
              ]}
            >
              <X
                size={16}
                color={
                  isApproved ? colors.textMuted : colors.statusDangerFg
                }
                strokeWidth={2.4}
              />
              <Text
                style={[
                  typography.captionMedium,
                  styles.decisionBtnText,
                  {
                    color: isApproved
                      ? colors.textMuted
                      : colors.statusDangerFg,
                  },
                ]}
              >
                Rechazar
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 15,
    fontWeight: "700",
  },
  rejectionSection: {
    gap: 8,
  },
  rejectionReasonBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  newProposalLink: {
    paddingVertical: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  executedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  executedLabel: {
    fontSize: 13,
  },
  approvalButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  decisionBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  decisionBtnText: {
    fontWeight: "700",
    fontSize: 13,
  },
});
