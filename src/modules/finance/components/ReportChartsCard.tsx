import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FinancialReportSummary } from "../types/finance.types";

export interface ReportChartsCardProps {
  report: FinancialReportSummary;
}

export const ReportChartsCard: React.FC<ReportChartsCardProps> = ({ report }) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.chartCard,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
      ]}
    >
      <View style={styles.chartHeader}>
        <Text style={[typography.titleCard, { color: colors.textStrong }]}>
          Servicios y Facturación
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Participación por categoría
        </Text>
      </View>

      <View
        style={[
          styles.stackedBarContainer,
          { backgroundColor: colors.surfaceTile, borderRadius: radius.full },
        ]}
      >
        {report.servicesBreakdown.map((srv) => (
          <View
            key={srv.id}
            style={[
              styles.stackedBarSegment,
              {
                flex: srv.percentage,
                backgroundColor: srv.color,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.servicesList}>
        {report.servicesBreakdown.map((srv) => (
          <View key={srv.id} style={styles.serviceItem}>
            <View style={styles.serviceHeaderRow}>
              <View style={styles.serviceTitleGroup}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: srv.color, borderRadius: radius.full },
                  ]}
                />
                <Text style={[typography.labelMd, { color: colors.textStrong }]}>
                  {srv.name}
                </Text>
              </View>
              <Text style={[typography.labelMd, { color: colors.textStrong }]}>
                {formatCurrency(srv.totalAmount)}
              </Text>
            </View>

            <View style={styles.serviceSubRow}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {srv.ordersCount} órdenes &middot;{" "}
                {srv.category === "parts" ? "Refacciones" : "Mano de obra"}
              </Text>
              <Text
                style={[
                  typography.captionMedium,
                  { color: colors.brandPrimary },
                ]}
              >
                {srv.percentage}%
              </Text>
            </View>

            <View
              style={[
                styles.progressBarBg,
                {
                  backgroundColor: colors.surfaceTile,
                  borderRadius: radius.full,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${srv.percentage}%`,
                    backgroundColor: srv.color,
                    borderRadius: radius.full,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  chartHeader: {
    gap: 2,
  },
  stackedBarContainer: {
    flexDirection: "row",
    height: 12,
    overflow: "hidden",
    gap: 2,
  },
  stackedBarSegment: {
    height: "100%",
  },
  servicesList: {
    gap: 14,
    marginTop: 4,
  },
  serviceItem: {
    gap: 4,
  },
  serviceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
  },
  serviceSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
  },
  progressBarBg: {
    height: 6,
    width: "100%",
    overflow: "hidden",
    marginTop: 2,
  },
  progressBarFill: {
    height: "100%",
  },
});

