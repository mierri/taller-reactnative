import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/theme";

export interface PlateChipProps {
  plate: string;
  style?: ViewStyle;
}

export const PlateChip: React.FC<PlateChipProps> = ({ plate, style }) => {
  const { colors, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: colors.surfaceChipNeutral,
          borderRadius: radius.xs,
        },
        style,
      ]}
    >
      <Text style={[typography.monoPlate, { color: colors.textSecondary }]}>
        {plate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
});
