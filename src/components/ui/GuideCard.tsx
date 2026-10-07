import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

export interface GuideCardProps {
  icon?: React.ReactNode;
  title: string;
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  icon,
  title,
  text,
  onPress,
  style,
}) => {
  const { colors, radii, spacing, shadows } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radii.card, // radio 22
          padding: spacing[5], // p 20 de la especificación
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {/* Tile 40x40 */}
      {icon && (
        <View
          style={[
            styles.tile,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radii.md, // radio 12
              marginBottom: spacing[3],
            },
          ]}
        >
          {icon}
        </View>
      )}

      {/* Título 14/20 600 */}
      <Text style={[styles.title, { color: colors.textStrong }]}>
        {title}
      </Text>

      {/* Texto 12/19.5 */}
      <Text
        style={[
          styles.text,
          { color: colors.textSecondary, marginTop: spacing[1] },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    width: '100%',
  },
  tile: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600', // 14/20 600
  },
  text: {
    fontSize: 12,
    lineHeight: 19.5, // 12/19.5
  },
});

