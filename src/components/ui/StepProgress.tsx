import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/theme";

export interface StepProgressProps {
  totalSteps: number;
  currentStep: number;
  style?: StyleProp<ViewStyle>;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  totalSteps,
  currentStep,
  style,
}) => {
  const { colors, radius } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                borderRadius: radius.full,
                backgroundColor: isActive
                  ? colors.brandPrimary
                  : colors.progressOff,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  segment: {
    flex: 1,
    height: 4,
  },
});
