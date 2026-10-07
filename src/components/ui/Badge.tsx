import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export type BadgeStatus =
  | 'neutral'
  | 'active'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'late'
  | 'archived'
  | 'recibida'
  | 'cotizando'
  | 'reparacion'
  | 'lista'
  | 'entregada';

export interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  showDot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  status = 'neutral',
  showDot = true,
  style,
}) => {
  const { colors } = useTheme();

  const getColorScheme = () => {
    switch (status) {
      case 'active':
      case 'recibida':
        return {
          bg: colors.statusActiveBg,
          fg: colors.statusActiveFg,
          border: colors.statusActiveBorder,
        };
      case 'success':
      case 'lista':
      case 'entregada':
        return {
          bg: colors.statusSuccessBg,
          fg: colors.statusSuccessFg,
          border: colors.statusSuccessBorder,
        };
      case 'warning':
      case 'cotizando':
        return {
          bg: colors.statusWarningBg,
          fg: colors.statusWarningFg,
          border: colors.statusWarningBorder,
        };
      case 'danger':
        return {
          bg: colors.statusDangerBg,
          fg: colors.statusDangerFg,
          border: colors.statusDangerBorder,
        };
      case 'late':
        return {
          bg: colors.statusLateBg,
          fg: colors.statusLateFg,
          border: colors.statusLateBorder,
        };
      case 'info':
      case 'reparacion':
        return {
          bg: colors.statusInfoBg,
          fg: colors.statusInfoFg,
          border: colors.statusInfoBorder,
        };
      case 'archived':
        return {
          bg: colors.statusArchivedBg,
          fg: colors.statusArchivedFg,
          border: colors.statusArchivedBorder,
        };
      case 'neutral':
      default:
        return {
          bg: colors.statusNeutralBg,
          fg: colors.statusNeutralFg,
          border: colors.statusNeutralBorder,
        };
    }
  };

  const scheme = getColorScheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
        },
        style,
      ]}
    >
      {showDot && (
        <View style={[styles.dot, { backgroundColor: scheme.fg }]} />
      )}
      <Text style={[styles.text, { color: scheme.fg }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '500',
  },
});
