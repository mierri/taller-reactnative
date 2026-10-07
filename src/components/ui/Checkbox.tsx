import { useTheme } from "@/theme";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

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
  const { colors, radii, spacing } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      style={[styles.container, { gap: spacing[2] }, style]}
    >
      <View
        style={[
          styles.box,
          {
            borderRadius: radii.xs, // radio 6
            borderColor: checked ? colors.brandPrimary : colors.borderInput,
            backgroundColor: checked
              ? colors.brandPrimary
              : colors.surfaceInput,
          },
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <Check size={14} color={colors.textOnBrand} strokeWidth={3} />
        )}
      </View>

      {label && (
        <Text style={[styles.label, { color: colors.textStrong }]}>
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
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  disabled: {
    opacity: 0.5,
  },
});
