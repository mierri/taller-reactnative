import { useTheme } from "@/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface SegmentedItem {
  key: string;
  label: string;
  count?: number;
}

export interface SegmentedProps {
  items: SegmentedItem[];
  selectedKey: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
}

export const Segmented: React.FC<SegmentedProps> = ({
  items,
  selectedKey,
  onChange,
  style,
}) => {
  const { colors, shadows, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceTrack,
          borderRadius: radius.lg,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const isActive = item.key === selectedKey;
        const hasCount = item.count !== undefined;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[
              styles.item,
              { borderRadius: radius.md },
              isActive && [
                { backgroundColor: colors.brandPrimary },
                shadows.segmented,
              ],
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: isActive ? colors.textOnBrand : colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>

            {hasCount && (
              <View
                style={[
                  styles.countChip,
                  {
                    borderRadius: radius.xs,
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.25)"
                      : colors.surfaceChipCount,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    {
                      color: isActive
                        ? colors.textOnBrand
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {item.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    gap: 8,
  },
  item: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  countChip: {
    height: 20,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
