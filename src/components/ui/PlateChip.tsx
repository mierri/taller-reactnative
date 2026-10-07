import React from 'react';
import { View, Text, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface PlateChipProps {
  plate: string;
  style?: ViewStyle;
}

export const PlateChip: React.FC<PlateChipProps> = ({ plate, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: colors.surfaceChipNeutral },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.textStrong,
            fontFamily: Platform.select({
              ios: 'Menlo',
              android: 'monospace',
              default: 'monospace',
            }),
          },
        ]}
      >
        {plate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
});

