import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components";
import { useTheme } from "@/theme";
import { OperationalStatus as OperationalStatusTokens } from "@/theme/tokens";
import { OperationalStatus } from "../../../types/work-order.types";

export interface DetailHeaderInfoProps {
  folio: string;
  statusLabel?: string;
  status?: OperationalStatus;
  isLate?: boolean;
  vehicleName: string;
  plate: string;
  clientName: string;
}

export const DetailHeaderInfo: React.FC<DetailHeaderInfoProps> = ({
  folio,
  statusLabel,
  status = OperationalStatus.RECIBIDA,
  isLate = false,
  vehicleName,
  plate,
  clientName,
}) => {
  const { colors, typography, radius, statusColors } = useTheme();

  const statusKey = (status as keyof typeof OperationalStatusTokens) || "RECIBIDA";
  const entry = OperationalStatusTokens[statusKey] || OperationalStatusTokens.RECIBIDA;
  const tone = statusColors(statusKey === "EN_ESPERA_APROBACION" ? "warning" : entry.family);
  const displayLabel = statusLabel || (
    statusKey === "EN_ESPERA_COTIZACION" ? "Por cotizar" :
    statusKey === "EN_ESPERA_APROBACION" ? "Por aprobar" :
    entry.label
  );

  return (
    <View style={styles.container}>
      <View style={styles.metaRow}>
        <Text style={[typography.captionMedium, { color: colors.textMuted }]}>
          {folio}
        </Text>
        <View style={styles.badgesGroup}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: tone.bg,
                borderColor: tone.border,
                borderRadius: radius.full,
              },
            ]}
          >
            <View
              style={[
                styles.statusBullet,
                { backgroundColor: tone.fg },
              ]}
            />
            <Text
              style={[
                typography.captionMedium,
                { color: tone.fg },
              ]}
            >
              {displayLabel}
            </Text>
          </View>
          {isLate && <Badge label="RETRASADA" family="late" />}
        </View>
      </View>

      <Text
        style={[
          typography.headingXl,
          { color: colors.textStrong },
        ]}
      >
        {vehicleName}
      </Text>

      <View style={styles.infoRow}>
        <View
          style={[
            styles.platePill,
            {
              backgroundColor: colors.surfaceInput,
              borderColor: colors.borderInput,
              borderRadius: radius.md,
            },
          ]}
        >
          <Text
            style={[
              typography.monoPlate,
              { color: colors.textSecondary },
            ]}
          >
            {plate}
          </Text>
        </View>

        <Text
          style={[
            typography.bodyMd,
            { color: colors.textSecondary },
          ]}
        >
          {clientName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgesGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  platePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
});
