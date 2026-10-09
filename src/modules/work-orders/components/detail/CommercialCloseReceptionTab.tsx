import { Switch } from "@/components";
import { useTheme } from "@/theme";
import { Lock, ShieldCheck, Wallet } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DetailPaymentItem } from "../../types/work-order-detail.types";
import { formatCurrency } from "../../utils/detail-formatters";
import { CommercialCloseFrozenView } from "./CommercialCloseFrozenView";
import { CommercialCloseHistorySection } from "./CommercialCloseHistorySection";

export interface CommercialCloseReceptionTabProps {
  subtotal: number;
  discountAmount?: number;
  taxAmount: number;
  total: number;
  requiresInvoice: boolean;
  onToggleRequiresInvoice: (val: boolean) => void;
  advanceTotal: number;
  onOpenRegisterAdvance: () => void;
  isCommercialClosed: boolean;
  onOpenConfirmCommercialClose: () => void;
  isCommercialCloseEnabled: boolean;
  onOpenRegisterPayment: () => void;
  payments: DetailPaymentItem[];
  isOrderClosed?: boolean;
}

export const CommercialCloseReceptionTab: React.FC<
  CommercialCloseReceptionTabProps
> = ({
  subtotal,
  discountAmount = 0,
  taxAmount,
  total,
  requiresInvoice,
  onToggleRequiresInvoice,
  advanceTotal,
  onOpenRegisterAdvance,
  isCommercialClosed,
  onOpenConfirmCommercialClose,
  isCommercialCloseEnabled,
  onOpenRegisterPayment,
  payments,
  isOrderClosed = false,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const pendingBalance = Math.max(0, total - advanceTotal);

  return (
    <View style={styles.container}>
      {!isCommercialClosed ? (
        <>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
              shadows.card,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
                CIERRE COMERCIAL
              </Text>
              <Lock size={16} color={colors.textMuted} strokeWidth={2} />
            </View>

            <View style={styles.amountLine}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "500" }]}>
                {formatCurrency(subtotal)}
              </Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.amountLine}>
                <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                  Descuento
                </Text>
                <Text style={[typography.bodyMd, { color: colors.statusDangerFg, fontWeight: "500" }]}>
                  -{formatCurrency(discountAmount)}
                </Text>
              </View>
            )}

            <View style={styles.amountLine}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                IVA (16%)
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "500" }]}>
                {formatCurrency(taxAmount)}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderDivider }]} />

            <View style={styles.totalLine}>
              <Text style={[typography.headingMd, { color: colors.textStrong }]}>
                Total
              </Text>
              <View style={styles.totalContainer}>
                <Text style={[typography.headingXl, { color: colors.brandPrimary, fontWeight: "700" }]}>
                  {formatCurrency(total)}
                </Text>
                <Text style={[typography.captionMedium, { color: colors.textMuted }]}>
                  MXN
                </Text>
              </View>
            </View>

            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Solo conceptos aprobados y ejecutadas. El IVA se guarda separado del ingreso neto.
            </Text>
          </View>

          <View
            style={[
              styles.switchCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
              shadows.card,
            ]}
          >
            <Switch value={requiresInvoice} onValueChange={onToggleRequiresInvoice} />
            <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "500" }]}>
              El cliente requiere factura
            </Text>
          </View>

          {!isCommercialCloseEnabled && (
            <View
              style={[
                styles.banner,
                {
                  backgroundColor: colors.statusWarningBg,
                  borderColor: colors.statusWarningBorder,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <ShieldCheck size={18} color={colors.statusWarningFg} strokeWidth={2} />
              <Text style={[typography.caption, { color: colors.statusWarningFg, flex: 1 }]}>
                El cierre se habilita después de aprobar el control de calidad. Puedes registrar un anticipo mientras tanto.
              </Text>
            </View>
          )}

          {!isOrderClosed && (
            <TouchableOpacity
              onPress={isCommercialCloseEnabled ? onOpenConfirmCommercialClose : undefined}
              disabled={!isCommercialCloseEnabled}
              activeOpacity={0.85}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: isCommercialCloseEnabled ? colors.brandPrimary : colors.borderControl,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Lock size={16} color={colors.textOnBrand} strokeWidth={2} />
              <Text style={[typography.buttonMd, { color: colors.textOnBrand, fontWeight: "700" }]}>
                Confirmar cierre comercial
              </Text>
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
              shadows.card,
            ]}
          >
            <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
              ESTADO DE CUENTA
            </Text>
            <View style={styles.amountLine}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                Anticipos registrados
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "600" }]}>
                {formatCurrency(advanceTotal)}
              </Text>
            </View>

            {!isOrderClosed && (
              <TouchableOpacity
                onPress={onOpenRegisterAdvance}
                activeOpacity={0.8}
                style={[
                  styles.secondaryBtn,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderButton,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                <Wallet size={18} color={colors.brandPrimary} strokeWidth={2} />
                <Text style={[typography.buttonMd, { color: colors.brandPrimary, fontWeight: "600" }]}>
                  Registrar anticipo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <CommercialCloseFrozenView
          total={total}
          advanceTotal={advanceTotal}
          pendingBalance={pendingBalance}
          isOrderClosed={isOrderClosed}
          onOpenRegisterPayment={onOpenRegisterPayment}
        />
      )}

      <CommercialCloseHistorySection payments={payments} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, paddingBottom: 24 },
  card: { padding: 18, borderWidth: 1, gap: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amountLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  divider: { height: 1, marginVertical: 2 },
  totalLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  totalContainer: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  switchCard: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, gap: 12 },
  banner: { flexDirection: "row", padding: 14, borderWidth: 1, gap: 10, alignItems: "flex-start" },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 52, gap: 8 },
  secondaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 48, borderWidth: 1, gap: 8, marginTop: 4 },
});
