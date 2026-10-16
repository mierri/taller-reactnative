import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface CashSummaryCardProps {
  grossTotal: number;
  commissionsTotal: number;
  netTotal: number;
}

export const CashSummaryCard: React.FC<CashSummaryCardProps> = ({
  grossTotal,
  commissionsTotal,
  netTotal,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
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
        COBROS DE HOY · BRUTO
      </Text>

      <Text
        style={[
          typography.headingXl,
          styles.grossAmount,
          { color: colors.brandPrimary },
        ]}
      >
        {formatCurrency(grossTotal)}
      </Text>

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.bottomRow}>
        <View style={styles.metricColumn}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Comisiones
          </Text>
          <Text style={[typography.titleCard, { color: colors.textStrong }]}>
            {formatCurrency(commissionsTotal)}
          </Text>
        </View>

        <View style={styles.metricColumn}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Neto recibido
          </Text>
          <Text style={[typography.titleCard, { color: colors.brandPrimary }]}>
            {formatCurrency(netTotal)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderWidth: 1,
    gap: 14,
  },
  grossAmount: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricColumn: {
    flex: 1,
    gap: 4,
  },
});
