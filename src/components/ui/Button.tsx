import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

export type ButtonType = 'Primary' | 'Secondary' | 'FAB' | 'Icon';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  type?: ButtonType;
  label?: string;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  floating?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'Primary',
  label,
  iconLeading,
  iconTrailing,
  icon,
  fullWidth = false,
  floating = true,
  disabled = false,
  loading = false,
  style,
  labelStyle,
  children,
  ...pressableProps
}) => {
  const { colors, radii, spacing, shadows } = useTheme();

  const isPrimary = type === 'Primary';
  const isSecondary = type === 'Secondary';
  const isFAB = type === 'FAB';
  const isIcon = type === 'Icon';

  const containerStyles: ViewStyle[] = [styles.base];

  if (isIcon) {
    containerStyles.push({
      width: 48,
      height: 48,
      borderRadius: radii.lg,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
    });
  } else {
    containerStyles.push({
      height: 52,
      paddingHorizontal: spacing[5], // px 20
      borderRadius: radii.lg,        // radio 16
      gap: isFAB ? spacing[2] : 10,  // gap 10 (FAB: 8 = spacing[2])
    });
  }

  if (isPrimary) {
    containerStyles.push(
      {
        backgroundColor: colors.brandPrimary,
      },
      shadows.button
    );
  } else if (isSecondary) {
    containerStyles.push({
      backgroundColor: colors.surfaceInput,
      borderWidth: 1.2,
      borderColor: colors.borderButton,
    });
  } else if (isFAB) {
    containerStyles.push(
      {
        backgroundColor: colors.brandPrimary,
      },
      shadows.fab
    );

    if (floating) {
      containerStyles.push({
        position: 'absolute',
        bottom: spacing[6], // 24px
        right: spacing[5],  // 20px
        zIndex: 99,
      });
    }
  }

  if (fullWidth && !isIcon && !isFAB) {
    containerStyles.push(styles.fullWidth);
  }

  let textStyles: TextStyle = {};
  let spinnerColor = colors.textOnBrand;

  if (isPrimary || isFAB) {
    spinnerColor = colors.textOnBrand;
    textStyles = {
      color: colors.textOnBrand,
      fontWeight: '600',
      ...(isFAB
        ? { fontSize: 13, lineHeight: 19.5 }
        : { fontSize: 14, lineHeight: 20 }),
    };
  } else if (isSecondary) {
    spinnerColor = colors.brandPrimary;
    textStyles = {
      color: colors.brandPrimary,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    };
  }

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        containerStyles,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : isIcon ? (
        <View style={styles.iconContainer}>{icon ?? children}</View>
      ) : (
        <>
          {iconLeading && <View style={styles.iconWrapper}>{iconLeading}</View>}

          {label ? (
            <Text style={[styles.textBase, textStyles, labelStyle]}>
              {label}
            </Text>
          ) : (
            children
          )}

          {iconTrailing && (
            <View style={styles.iconWrapper}>{iconTrailing}</View>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  textBase: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
