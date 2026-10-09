import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DetailPaymentItem } from "../../types/work-order-detail.types";
import { formatCurrency } from "../../utils/detail-formatters";

export interface CommercialCloseHistorySectionProps {
  payments: DetailPaymentItem[];
}

export const CommercialCloseHistorySection: React.FC<
  CommercialCloseHistorySectionProps
> = ({ payments }) => {
  const { colors, typography, radius, shadows } = useTheme();

  if (!payments || payments.length === 0) return null;

  const getMethodLabel = (method: DetailPaymentItem["paymentMethod"]) => {
    switch (method) {
      case "CARD":
        return "Tarjeta";
      case "TRANSFER":
        return "Transferencia";
      default:
        return "Efectivo";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
        HISTORIAL DE COBROS
      </Text>
      {payments.map((pay) => (
        <View
          key={pay.id}
          style={[
            styles.paymentRow,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.xl,
            },
            shadows.card,
          ]}
        >
          <View style={styles.paymentLeft}>
            <Text
              style={[
                typography.bodyMd,
                { color: colors.textStrong, fontWeight: "600" },
              ]}
            >
              {getMethodLabel(pay.paymentMethod)}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {pay.createdAt} · Neto {formatCurrency(pay.netAmount ?? pay.amount)}
            </Text>
          </View>
          <Text
            style={[
              typography.headingMd,
              { color: colors.brandPrimary, fontWeight: "700" },
            ]}
          >
            {formatCurrency(pay.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 4,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
  },
  paymentLeft: {
    gap: 4,
  },
});
