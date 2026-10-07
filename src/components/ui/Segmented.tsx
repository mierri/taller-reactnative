import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/theme";

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
  const { colors, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceTrack },
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
              isActive && [
                styles.activeItem,
                { backgroundColor: colors.brandPrimary },
                shadows.segmented,
              ],
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color: isActive ? "#ffffff" : colors.textLabel,
                  fontWeight: isActive ? "600" : "500",
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
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.25)"
                      : colors.surfaceChipCount,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    {
                      color: isActive ? "#ffffff" : colors.textStrong,
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
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  item: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
  },
  activeItem: {},
  itemText: {
    fontSize: 11,
    lineHeight: 16.5,
  },
  countChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: "600",
  },
});
