import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from "react-native";
import { CarFront } from "lucide-react-native";
import { useTheme } from "@/theme";
import { Badge, BadgeStatus } from "./Badge";
import { PlateChip } from "./PlateChip";

export interface OrderCardProps {
  folio: string;
  deadline?: string;
  vehicle: string;
  plate: string;
  client: string;
  status: string;
  statusType?: BadgeStatus;
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
  statusType = "active",
  advisor,
  advisorInitial,
  progress = 1,
  isLate = false,
  onPress,
  style,
}) => {
  const { colors, shadows, radii } = useTheme();

  const totalSteps = 6;
  const currentStep = Math.min(Math.max(progress, 0), totalSteps);
  const initial =
    advisorInitial ?? (advisor ? advisor.trim().charAt(0).toUpperCase() : "");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radii.card,
        },
        shadows.card,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.folio,
            {
              color: colors.textMuted,
              fontFamily: Platform.select({
                ios: "Menlo",
                android: "monospace",
                default: "monospace",
              }),
            },
          ]}
        >
          {folio}
        </Text>
        {deadline && (
          <Text style={[styles.deadline, { color: colors.textMuted }]}>
            {deadline}
          </Text>
        )}
      </View>

      <View style={styles.vehicleRow}>
        <View
          style={[styles.iconTile, { backgroundColor: colors.surfaceTile }]}
        >
          <CarFront size={23} color={colors.brandPrimary} />
        </View>

        <View style={styles.vehicleInfo}>
          <Text
            style={[styles.vehicleTitle, { color: colors.textStrong }]}
            numberOfLines={1}
          >
            {vehicle}
          </Text>

          <View style={styles.metaRow}>
            <PlateChip plate={plate} />
            <Text
              style={[styles.clientText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {client}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusAndAdvisorRow}>
        <View style={styles.badgesWrapper}>
          <Badge label={status} status={statusType} />
          {isLate && <Badge label="RETRASADA" status="late" />}
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
                    styles.advisorInitialText,
                    { color: colors.accentAvatarText },
                  ]}
                >
                  {initial}
                </Text>
              </View>
            ) : null}
            <Text
              style={[styles.advisorName, { color: colors.textSecondary }]}
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
    padding: 18,
    borderWidth: 1.2,
    width: "100%",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folio: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "500",
  },
  deadline: {
    fontSize: 10,
    lineHeight: 15,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleTitle: {
    fontSize: 15,
    lineHeight: 22.5,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clientText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  statusAndAdvisorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 2,
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
    gap: 6,
  },
  advisorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  advisorInitialText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
  },
  advisorName: {
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: "500",
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    width: "100%",
    marginTop: 4,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
