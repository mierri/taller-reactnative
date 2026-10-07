import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/theme';

interface AppLogoProps {
  variant?: 'icon' | 'full';
  size?: number;
  style?: ViewStyle;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'icon',
  size = 56,
  style,
}) => {
  const { isDark } = useTheme();

  // Selección de SVG según tema y variante
  const iconSource = isDark
    ? require('@/assets/logos/icon-logo-darkmode.svg')
    : require('@/assets/logos/icon-logo-lightmode.svg');

  const fullSource = isDark
    ? require('@/assets/logos/logo-darkmode.svg')
    : require('@/assets/logos/logo-lightmode.svg');

  const source = variant === 'icon' ? iconSource : fullSource;

  // Proporción de aspecto
  const aspectRatio = variant === 'icon' ? 1 : 740 / 252;
  const width = size * aspectRatio;
  const height = size;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={{ width, height }}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

