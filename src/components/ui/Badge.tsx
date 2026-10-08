import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/theme";
import type { StatusFamily } from "@/theme/tokens";

export type BadgeStatus = StatusFamily;

export interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  family?: StatusFamily;
  showDot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  status,
  family,
  showDot = true,
  style,
}) => {
  const { statusColors, typography, radius } = useTheme();
  const activeFamily: StatusFamily = family ?? status ?? "neutral";
  const tone = statusColors(activeFamily);
  const isLate = activeFamily === "late";

  if (isLate) {
    return (
      <View
        style={[
          styles.lateBadge,
          {
            backgroundColor: tone.bg,
            borderRadius: radius.sm,
          },
          style,
        ]}
      >
        <Clock size={12} color={tone.fg} strokeWidth={2.2} />
        <Text
          style={[
            typography.captionMedium,
            styles.lateText,
            { color: tone.fg },
          ]}
        >
          {label.toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          borderRadius: radius.sm,
        },
        style,
      ]}
    >
      {showDot && <View style={[styles.dot, { backgroundColor: tone.fg }]} />}
      <Text style={[typography.captionMedium, { color: tone.fg }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  lateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lateText: {
    letterSpacing: 0.2,
  },
});
