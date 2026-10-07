import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface StepProgressProps {
  totalSteps: number;
  currentStep: number; // 1-based (ej: 1, 2, 3)
  style?: StyleProp<ViewStyle>;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  totalSteps,
  currentStep,
  style,
}) => {
  const { colors, radii, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing[2] }, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                borderRadius: radii.xs,
                backgroundColor: isActive
                  ? colors.brandPrimary
                  : colors.surfaceChipCount, // #dbe3ce / inactivo
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4, // h 4 de la especificación
  },
});

