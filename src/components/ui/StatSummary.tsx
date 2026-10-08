import { useTheme } from "@/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface StatItem {
  value: string | number;
  label: string;
  onPress?: () => void;
}

export interface StatSummaryProps {
  stats: StatItem[];
  style?: ViewStyle;
}

export const StatSummary: React.FC<StatSummaryProps> = ({ stats, style }) => {
  const { colors, shadows, radii } = useTheme();

  const items = stats.slice(0, 3);

  return (
    <View
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
    >
      {items.map((stat, index) => {
        const isLast = index === items.length - 1;
        const formattedValue =
          typeof stat.value === "number" && stat.value < 10
            ? `0${stat.value}`
            : `${stat.value}`;

        return (
          <React.Fragment key={stat.label + index}>
            <TouchableOpacity
              style={styles.column}
              onPress={stat.onPress}
              disabled={!stat.onPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.value, { color: colors.textStrong }]}>
                {formattedValue}
              </Text>
              <Text
                style={[styles.label, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {stat.label}
              </Text>
            </TouchableOpacity>

            {!isLast && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.borderDivider },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    width: "100%",
  },
  column: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  divider: {
    width: 1.2,
    height: 36,
  },
  value: {
    fontSize: 26,
    fontWeight: "500",
  },
  label: {
    fontSize: 10,
    lineHeight: 15,
  },
});
