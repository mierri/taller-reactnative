import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { ShieldCheck } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FinancialReportSummary } from "../types/finance.types";

export interface ReportMetricsCardProps {
  report: FinancialReportSummary;
}

export const ReportMetricsCard: React.FC<ReportMetricsCardProps> = ({ report }) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <>
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.borderCard,
            borderRadius: radius.xl,
          },
          shadows.card,
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Venta antes de descuento
          </Text>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            {formatCurrency(report.salesBeforeDiscount)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Descuentos
          </Text>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            -{formatCurrency(report.discounts)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            IVA por separado
          </Text>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            {formatCurrency(report.taxSeparate)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Comisiones de tarjeta
          </Text>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            -{formatCurrency(report.cardCommissions)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Venta sin IVA ni descuento
          </Text>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            {formatCurrency(report.salesNet)}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Flujo neto recibido en caja
          </Text>
          <Text style={[typography.headingMd, { color: colors.brandPrimary }]}>
            {formatCurrency(report.netCashFlow)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.infoBanner,
          {
            backgroundColor: colors.surfaceTile,
            borderColor: colors.borderDivider,
            borderRadius: radius.xl,
          },
        ]}
      >
        <ShieldCheck size={18} color={colors.brandPrimary} strokeWidth={2.2} />
        <Text
          style={[
            typography.caption,
            styles.infoBannerText,
            { color: colors.textSecondary },
          ]}
        >
          El IVA no es ganancia. Las ventas provienen solo de cierres. El flujo
          de caja incluye anticipos, impuestos, comisiones e ingresos o gastos
          manuales; no es utilidad.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    padding: 20,
    borderWidth: 1,
    gap: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryRowHighlight: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 16,
    borderWidth: 1,
  },
  infoBannerText: {
    flex: 1,
    lineHeight: 18,
  },
});

