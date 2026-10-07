import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/theme';

export type BannerType = 'Info' | 'Warning' | 'Danger' | 'Success';
export type BannerLayout = 'Inline' | 'Floating';

export interface BannerProps {
  type?: BannerType;
  layout?: BannerLayout;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoDismiss?: boolean;
  duration?: number;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Banner: React.FC<BannerProps> = ({
  type = 'Info',
  layout = 'Inline',
  title,
  message,
  dismissible,
  autoDismiss,
  duration = 3500,
  onDismiss,
  style,
}) => {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const isFloating = layout === 'Floating';
  const shouldDismiss = dismissible ?? isFloating;
  const shouldAutoDismiss = autoDismiss ?? isFloating;

  const [opacity] = useState(() => new Animated.Value(isFloating ? 0 : 1));
  const [translateY] = useState(() => new Animated.Value(isFloating ? -16 : 0));

  useEffect(() => {
    if (isFloating) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFloating, opacity, translateY]);

  const handleDismiss = useCallback(() => {
    if (isFloating) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -16,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    } else {
      onDismiss?.();
    }
  }, [isFloating, opacity, translateY, onDismiss]);

  useEffect(() => {
    if (shouldAutoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [shouldAutoDismiss, duration, onDismiss, handleDismiss]);

  const getTypeConfig = () => {
    switch (type) {
      case 'Warning':
        return {
          bg: colors.statusWarningBg,
          fg: colors.statusWarningFg,
          border: colors.statusWarningBorder,
          icon: AlertTriangle,
          defaultTitle: 'Advertencia',
        };
      case 'Danger':
        return {
          bg: colors.statusDangerBg,
          fg: colors.statusDangerFg,
          border: colors.statusDangerBorder,
          icon: AlertOctagon,
          defaultTitle: 'Error',
        };
      case 'Success':
        return {
          bg: colors.statusSuccessBg,
          fg: colors.statusSuccessFg,
          border: colors.statusSuccessBorder,
          icon: CheckCircle2,
          defaultTitle: 'Listo',
        };
      case 'Info':
      default:
        return {
          bg: colors.statusInfoBg,
          fg: colors.statusInfoFg,
          border: colors.statusInfoBorder,
          icon: Info,
          defaultTitle: 'Información',
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;
  const topOffset = Math.max(insets.top, 16) + 8;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        isFloating
          ? [
              styles.floating,
              { top: topOffset, opacity, transform: [{ translateY }] },
              shadows.floating,
            ]
          : styles.inline,
        style,
      ]}
      accessibilityRole={type === 'Danger' ? 'alert' : 'summary'}
    >
      <View style={styles.iconWrapper}>
        <IconComponent size={16} color={config.fg} strokeWidth={2.2} />
      </View>

      <View style={styles.textWrapper}>
        {title !== undefined && (
          <Text style={[styles.title, { color: config.fg }]}>
            {title || config.defaultTitle}
          </Text>
        )}
        <Text style={[styles.message, { color: config.fg }]}>
          {message}
        </Text>
      </View>

      {shouldDismiss && onDismiss && (
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <X size={16} color={config.fg} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    boxSizing: 'border-box',
  },
  inline: {
    width: '100%',
  },
  floating: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 10,
  },
  iconWrapper: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -8,
    marginRight: -6,
  },
});
