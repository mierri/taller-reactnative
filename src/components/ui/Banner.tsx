import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  X,
} from "lucide-react-native";
import { useTheme } from "@/theme";
import type { StatusFamily } from "@/theme/tokens";

export type BannerType = "Info" | "Warning" | "Danger" | "Success";
export type BannerLayout = "Inline" | "Floating";

export interface BannerProps {
  type?: BannerType;
  layout?: BannerLayout;
  variant?: "default" | "dark";
  title?: string;
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  dismissible?: boolean;
  autoDismiss?: boolean;
  duration?: number;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Banner: React.FC<BannerProps> = ({
  type = "Info",
  layout = "Inline",
  variant = "default",
  title,
  message,
  actionText,
  onActionPress,
  dismissible,
  autoDismiss,
  duration = 3500,
  onDismiss,
  style,
}) => {
  const { statusColors, typography, radius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const isFloating = layout === "Floating";
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

  const family: StatusFamily =
    type === "Warning"
      ? "warning"
      : type === "Danger"
        ? "danger"
        : type === "Success"
          ? "success"
          : "info";

  const tone = statusColors(family);
  const bg = tone.bg;
  const fg = tone.fg;
  const border = tone.border;

  const IconComponent =
    type === "Warning"
      ? AlertTriangle
      : type === "Danger"
        ? AlertOctagon
        : type === "Success"
          ? CheckCircle2
          : Info;

  const topOffset = insets.top + 72;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          borderRadius: radius.lg,
          paddingRight: shouldDismiss ? 12 : 16,
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
      accessibilityRole={type === "Danger" ? "alert" : "summary"}
    >
      <IconComponent size={20} color={fg} strokeWidth={2.2} />

      <View style={styles.textWrapper}>
        {title && (
          <Text style={[typography.labelLg, { color: fg }]}>{title}</Text>
        )}
        <Text style={[typography.bodyMd, { color: fg }]}>{message}</Text>
        {actionText && onActionPress && (
          <TouchableOpacity
            onPress={onActionPress}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Text style={[typography.buttonMd, { color: fg }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {shouldDismiss && onDismiss && (
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <X size={18} color={fg} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingLeft: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inline: {
    width: "100%",
  },
  floating: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  actionBtn: {
    paddingTop: 4,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
