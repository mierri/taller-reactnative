import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Check } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  style,
}) => {
  const { colors, radius, typography } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.box,
          {
            borderRadius: radius.xs,
            borderColor: checked ? colors.brandPrimary : colors.borderControl,
            backgroundColor: checked
              ? colors.brandPrimary
              : colors.surfaceInput,
          },
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <Check size={16} color={colors.textOnBrand} strokeWidth={2.6} />
        )}
      </View>

      {label && (
        <Text style={[typography.bodyLg, { color: colors.textLabel }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    paddingVertical: 12,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  disabled: {
    opacity: 0.4,
  },
});
