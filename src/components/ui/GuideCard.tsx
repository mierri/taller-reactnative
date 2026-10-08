import React from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/theme";

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
  const { colors, radius, shadows, typography } = useTheme();

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
          borderRadius: radius.xl,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.tile,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.md,
            },
          ]}
        >
          {icon}
        </View>
      )}

      <Text style={[typography.buttonMd, { color: colors.textStrong }]}>
        {title}
      </Text>

      <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    width: "100%",
    padding: 20,
    gap: 12,
  },
  tile: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
