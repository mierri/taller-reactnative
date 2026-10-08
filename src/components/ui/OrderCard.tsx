import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { CarFront, ChevronRight, Clock } from "lucide-react-native";
import { useTheme } from "@/theme";
import type { StatusFamily } from "@/theme/tokens";
import { Badge } from "./Badge";
import { PlateChip } from "./PlateChip";

export interface OrderCardProps {
  folio: string;
  deadline?: string;
  vehicle: string;
  plate: string;
  client: string;
  status: string;
  statusFamily?: StatusFamily;
  statusType?: string;
  advisor?: string;
  advisorInitial?: string;
  progress?: number;
  isLate?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  folio,
  deadline,
  vehicle,
  plate,
  client,
  status,
  statusFamily,
  statusType,
  advisor,
  advisorInitial,
  progress = 1,
  isLate = false,
  onPress,
  style,
}) => {
  const { colors, shadows, typography, radius } = useTheme();

  const totalSteps = 6;
  const currentStep = Math.min(Math.max(progress, 0), totalSteps);
  const initial =
    advisorInitial ?? (advisor ? advisor.trim().charAt(0).toUpperCase() : "");

  const resolvedFamily = (statusFamily ??
    statusType ??
    "active") as StatusFamily;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={styles.metaRow}>
        <Text style={[typography.monoId, { color: colors.textMuted }]}>
          {folio}
        </Text>
        {deadline && (
          <View style={styles.dueContainer}>
            <Clock size={12} color={colors.textMuted} strokeWidth={2} />
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {deadline}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mainRow}>
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

        <View style={styles.info}>
          <Text
            style={[typography.titleCard, { color: colors.textStrong }]}
            numberOfLines={1}
          >
            {vehicle}
          </Text>

          <View style={styles.plateAndClient}>
            <PlateChip plate={plate} />
            <Text
              style={[
                typography.caption,
                styles.clientText,
                { color: colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {client}
            </Text>
          </View>
        </View>

        <ChevronRight size={20} color={colors.textMuted} />
      </View>

      <View style={[styles.footer, { borderTopColor: colors.borderDivider }]}>
        <View style={styles.badgesWrapper}>
          <Badge label={status} family={resolvedFamily} />
          {isLate && <Badge label="RETRASADA" family="late" />}
        </View>

        {advisor && (
          <View style={styles.advisorWrapper}>
            {initial ? (
              <View
                style={[
                  styles.advisorAvatar,
                  { backgroundColor: colors.surfaceAvatar },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    { color: colors.accentAvatarText },
                  ]}
                >
                  {initial}
                </Text>
              </View>
            ) : null}
            <Text
              style={[typography.caption, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {advisor}
            </Text>
          </View>
        )}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    width: "100%",
    gap: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  dueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mainRow: {
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
  info: {
    flex: 1,
    gap: 4,
  },
  plateAndClient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clientText: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  badgesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  advisorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  advisorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
