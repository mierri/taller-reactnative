import { useTheme } from "@/theme";
import { Check, Lock, Wallet } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "../../utils/detail-formatters";

export interface CommercialCloseFrozenViewProps {
  total: number;
  advanceTotal: number;
  pendingBalance: number;
  isOrderClosed: boolean;
  onOpenRegisterPayment: () => void;
}

export const CommercialCloseFrozenView: React.FC<
  CommercialCloseFrozenViewProps
> = ({
  total,
  advanceTotal,
  pendingBalance,
  isOrderClosed,
  onOpenRegisterPayment,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
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
            TOTAL CONGELADO
          </Text>
          <Lock size={16} color={colors.textMuted} strokeWidth={2} />
        </View>
        <View style={styles.totalContainer}>
          <Text
            style={[
              typography.headingXl,
              { color: colors.brandPrimary, fontSize: 32, fontWeight: "700" },
            ]}
          >
            {formatCurrency(total)}
          </Text>
          <Text style={[typography.captionMedium, { color: colors.textMuted }]}>
            MXN
          </Text>
        </View>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Solo conceptos aprobados y ejecutadas. El IVA se guarda separado del
          ingreso neto.
        </Text>
      </View>

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
            Pagos y anticipos
          </Text>
          <Text
            style={[
              typography.bodyMd,
              { color: colors.textStrong, fontWeight: "600" },
            ]}
          >
            {formatCurrency(advanceTotal)}
          </Text>
        </View>
        <View style={styles.amountLine}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Saldo pendiente
          </Text>
          <Text
            style={[
              typography.headingMd,
              { color: colors.brandPrimary, fontWeight: "700" },
            ]}
          >
            {formatCurrency(pendingBalance)}
          </Text>
        </View>

        {!isOrderClosed && pendingBalance > 0 ? (
          <TouchableOpacity
            onPress={onOpenRegisterPayment}
            activeOpacity={0.85}
            style={[
              styles.primaryBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Wallet size={18} color={colors.textOnBrand} strokeWidth={2} />
            <Text
              style={[
                typography.buttonMd,
                { color: colors.textOnBrand, fontWeight: "700" },
              ]}
            >
              Registrar cobro
            </Text>
          </TouchableOpacity>
        ) : pendingBalance <= 0 ? (
          <View
            style={[
              styles.liquidatedPill,
              {
                backgroundColor: colors.statusActiveBg,
                borderColor: colors.statusActiveBorder,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Check size={18} color={colors.statusActiveFg} strokeWidth={2.4} />
            <Text
              style={[
                typography.buttonMd,
                { color: colors.statusActiveFg, fontWeight: "700" },
              ]}
            >
              Orden liquidada
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: { padding: 18, borderWidth: 1, gap: 14 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalContainer: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
  },
  liquidatedPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
});
