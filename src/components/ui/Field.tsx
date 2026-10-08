import { useTheme } from "@/theme";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

export type FieldType = "Text" | "Select" | "Textarea";

export interface FieldProps extends Omit<TextInputProps, "style"> {
  type?: FieldType;
  label?: string;
  helper?: string | boolean;
  error?: string | boolean;
  trailingIcon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  boxStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Field: React.FC<FieldProps> = ({
  type = "Text",
  label,
  value,
  placeholder,
  helper,
  error,
  trailingIcon,
  leadingIcon,
  onPress,
  containerStyle,
  boxStyle,
  inputStyle,
  onFocus,
  onBlur,
  editable = true,
  ...inputProps
}) => {
  const { colors, radius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isTextarea = type === "Textarea";
  const isSelect = type === "Select";
  const hasError = Boolean(error);
  const isFilled = Boolean(value && String(value).length > 0);

  const borderWidth = isFocused ? 2 : hasError ? 1.5 : 1;
  const borderColor = hasError
    ? colors.statusDangerFg
    : isFocused
      ? colors.borderFocus
      : colors.borderInput;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const controlContent = (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.surfaceInput,
          borderColor,
          borderWidth,
          borderRadius: radius.lg,
          paddingHorizontal: 16,
          minHeight: isTextarea ? 104 : 52,
          height: isTextarea ? undefined : 52,
          paddingVertical: isTextarea ? 16 : 0,
        },
        isTextarea && styles.boxTextarea,
        boxStyle,
      ]}
    >
      {leadingIcon && <View style={styles.leading}>{leadingIcon}</View>}

      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        editable={isSelect ? false : editable}
        multiline={isTextarea}
        textAlignVertical={isTextarea ? "top" : "center"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          typography.input,
          {
            color: isFilled ? colors.textStrong : colors.textPlaceholder,
            height: isTextarea ? undefined : "100%",
          },
          inputStyle,
          !isTextarea && styles.singleLine,
        ]}
        {...inputProps}
      />

      {isSelect && !trailingIcon && (
        <ChevronDown size={20} color={colors.textMuted} />
      )}

      {trailingIcon && <View style={styles.trailing}>{trailingIcon}</View>}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            typography.labelLg,
            styles.label,
            { color: colors.textLabel },
          ]}
        >
          {label}
        </Text>
      )}

      {isSelect ? (
        <Pressable onPress={onPress} disabled={!editable}>
          {controlContent}
        </Pressable>
      ) : (
        controlContent
      )}

      {typeof error === "string" && error.length > 0 ? (
        <Text
          style={[
            typography.bodyMd,
            styles.helper,
            { color: colors.statusDangerFg },
          ]}
        >
          {error}
        </Text>
      ) : typeof helper === "string" && helper.length > 0 ? (
        <Text
          style={[
            typography.bodyMd,
            styles.helper,
            { color: colors.textSecondary },
          ]}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  label: {
    marginBottom: 0,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  boxTextarea: {
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
  },
  singleLine: {
    height: "100%",
    lineHeight: undefined,
    textAlignVertical: "center",
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
  },
  leading: {
    justifyContent: "center",
    alignItems: "center",
  },
  trailing: {
    justifyContent: "center",
    alignItems: "center",
  },
  helper: {
    marginTop: 2,
    paddingLeft: 2,
  },
});
