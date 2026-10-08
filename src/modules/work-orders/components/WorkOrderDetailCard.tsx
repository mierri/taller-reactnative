import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CarFront, Clock } from "lucide-react-native";
import { Badge, PlateChip } from "@/components";
import { useTheme } from "@/theme";
import { WorkOrderCardModel } from "../types/work-order.types";

export interface WorkOrderDetailCardProps {
  order: WorkOrderCardModel;
}

export const WorkOrderDetailCard: React.FC<WorkOrderDetailCardProps> = ({
  order,
}) => {
  const { colors, radius, shadows, typography } = useTheme();
  const totalSteps = 6;
  const currentStep = order.progress;

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
      <View style={styles.topRow}>
        <View style={styles.folioGroup}>
          <Text style={[typography.monoId, { color: colors.textMuted }]}>
            {order.folio}
          </Text>
          <View style={styles.badgeRow}>
            <Badge label={order.status} family={order.statusFamily} />
            {order.isLate && <Badge label="RETRASADA" family="late" />}
          </View>
        </View>

        <View style={styles.dateGroup}>
          <Clock size={12} color={colors.textMuted} strokeWidth={2} />
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {order.deadline}
          </Text>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.vehicleRow}>
        <View
          style={[
            styles.iconTile,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.md,
            },
          ]}
        >
          <CarFront size={24} color={colors.brandPrimaryText} />
        </View>

        <View style={styles.vehicleInfo}>
          <Text
            style={[typography.titleCard, { color: colors.textStrong }]}
            numberOfLines={1}
          >
            {order.vehicle}
          </Text>
          <View style={styles.metaRow}>
            <PlateChip plate={order.plate} />
            <Text
              style={[
                typography.caption,
                styles.clientText,
                { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {order.client}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
            {`AVANCE OPERATIVO (${currentStep} DE ${totalSteps})`}
          </Text>
        </View>

        <View style={styles.progressRow}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isDone = i < currentStep;
            return (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  {
                    borderRadius: radius.full,
                    backgroundColor: isDone
                      ? colors.progressDone
                      : colors.progressOff,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    width: "100%",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  folioGroup: {
    gap: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconTile: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clientText: {
    flex: 1,
  },
  progressContainer: {
    gap: 8,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  progressSegment: {
    flex: 1,
    height: 4,
  },
});
