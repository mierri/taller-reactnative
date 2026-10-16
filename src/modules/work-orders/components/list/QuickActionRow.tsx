import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface QuickActionRowProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isDown?: boolean;
  showDivider?: boolean;
  onPress: () => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({
  title,
  subtitle,
  icon,
  isDown,
  showDivider = true,
  onPress,
}) => {
  const { colors, radius, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && {
          borderBottomColor: colors.borderDivider,
          borderBottomWidth: 1,
        },
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.iconTile,
          {
            backgroundColor: colors.surfaceTile,
            borderRadius: radius.md,
          },
        ]}
      >
        {icon}
      </View>
      <View style={styles.textCol}>
        <Text style={[typography.labelLg, { color: colors.textStrong }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {isDown ? (
        <ChevronDown size={18} color={colors.textMuted} />
      ) : (
        <ChevronRight size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconTile: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});

