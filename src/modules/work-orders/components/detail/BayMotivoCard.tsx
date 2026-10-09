import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/theme";
import {
  formatDetailDate,
  formatNumberWithCommas,
} from "../../utils/detail-formatters";

export interface BayMotivoCardProps {
  failureDescription: string;
  mileageIn: number;
  fuelLevel: number;
  estimatedDelivery: string | null;
}

export const BayMotivoCard: React.FC<BayMotivoCardProps> = ({
  failureDescription,
  mileageIn,
  fuelLevel,
  estimatedDelivery,
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
        MOTIVO DE INGRESO
      </Text>

      <Text
        style={[
          typography.bodyLg,
          styles.descriptionText,
          { color: colors.textStrong },
        ]}
      >
        {failureDescription || "Revisión preventiva"}
      </Text>

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.metaFooter}>
        <Text
          style={[typography.captionMedium, { color: colors.textSecondary }]}
        >
          {formatNumberWithCommas(mileageIn)} km · {fuelLevel}% combustible
        </Text>

        <View style={styles.dateRow}>
          <Clock size={13} color={colors.textMuted} strokeWidth={2} />
          <Text
            style={[typography.captionMedium, { color: colors.textMuted }]}
          >
            {formatDetailDate(estimatedDelivery)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  metaFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
