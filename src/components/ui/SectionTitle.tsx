import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

export interface SectionTitleProps {
  title: string;
  count?: number;
  countSingular?: string;
  countPlural?: string;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const formatCountText = (
  count: number,
  singular = "orden",
  plural = "órdenes",
): string => {
  return `${count} ${count === 1 ? singular : plural}`;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  count,
  countSingular = "orden",
  countPlural = "órdenes",
  rightAction,
  style,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[typography.eyebrow, { color: colors.textMuted }]}
        numberOfLines={1}
      >
        {title.toUpperCase()}
      </Text>

      <View style={styles.rightContainer}>
        {count !== undefined && (
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {formatCountText(count, countSingular, countPlural)}
          </Text>
        )}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 48,
    gap: 8,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
