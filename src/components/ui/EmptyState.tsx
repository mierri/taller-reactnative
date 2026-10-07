import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Button, ButtonType } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionButtonType?: ButtonType;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Tu primer vehículo empieza aquí',
  description = 'Toca Recibir auto para registrar al cliente y comenzar el diagnóstico.',
  actionLabel,
  actionButtonType = 'Secondary',
  onActionPress,
  style,
}) => {
  const { colors, radii } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.borderDashed,
          borderRadius: radii.xl ?? 24,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.iconTile,
          { backgroundColor: colors.surfaceTile },
        ]}
      >
        {icon ?? <ClipboardList size={28} color={colors.brandPrimary} />}
      </View>

      <Text style={[styles.title, { color: colors.textStrong }]}>
        {title}
      </Text>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>

      {actionLabel && onActionPress && (
        <View style={styles.actionContainer}>
          <Button
            label={actionLabel}
            onPress={onActionPress}
            type={actionButtonType}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.2,
    borderStyle: 'dashed',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 19.5,
    textAlign: 'center',
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: 8,
    width: '100%',
    maxWidth: 240,
  },
});

