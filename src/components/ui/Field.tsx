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
  /** Variante del campo */
  type?: FieldType;
  /** Etiqueta sobre el campo */
  label?: string;
  /** Texto o booleano de ayuda */
  helper?: string | boolean;
  /** Mensaje de error (activa State=Error) */
  error?: string | boolean;
  /** Icono al final de la caja */
  trailingIcon?: React.ReactNode;
  /** Icono al inicio de la caja */
  leadingIcon?: React.ReactNode;
  /** Callback al presionar (para Select o campos accionables) */
  onPress?: () => void;
  /** Estilos adicionales para el contenedor exterior */
  containerStyle?: ViewStyle;
  /** Estilos adicionales para la caja */
  boxStyle?: ViewStyle;
  /** Estilos adicionales para el input */
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
  const { colors, radii, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isTextarea = type === "Textarea";
  const isSelect = type === "Select";
  const hasError = Boolean(error);
  const isFilled = Boolean(value && String(value).length > 0);

  const borderColor = hasError
    ? colors.statusDangerFg
    : isFocused
      ? colors.brandPrimary
      : colors.borderInput;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const content = (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.surfaceInput,
          borderColor,
          borderRadius: radii.lg,
          paddingHorizontal: spacing[4],
          minHeight: isTextarea ? 110 : 52,
          height: isTextarea ? undefined : 52,
          paddingVertical: isTextarea ? 14 : 0,
        },
        isTextarea && styles.boxTextarea,
        boxStyle,
      ]}
    >
      {leadingIcon && (
        <View style={[styles.leading, { marginRight: spacing[2] }]}>
          {leadingIcon}
        </View>
      )}

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
          {
            color: isFilled ? colors.textStrong : colors.textPlaceholder,
            height: isTextarea ? undefined : "100%",
          },
          isTextarea && styles.inputTextarea,
          inputStyle,
        ]}
        {...inputProps}
      />

      {isSelect && !trailingIcon && (
        <ChevronDown size={20} color={colors.textSecondary} />
      )}

      {trailingIcon && (
        <View style={[styles.trailing, { marginLeft: spacing[2] }]}>
          {trailingIcon}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textLabel }]}>{label}</Text>
      )}

      {isSelect ? (
        <Pressable onPress={onPress} disabled={!editable}>
          {content}
        </Pressable>
      ) : (
        content
      )}

      {typeof error === "string" && error.length > 0 ? (
        <Text style={[styles.helper, { color: colors.statusDangerFg }]}>
          {error}
        </Text>
      ) : typeof helper === "string" && helper.length > 0 ? (
        <Text style={[styles.helper, { color: colors.textMuted }]}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    lineHeight: 19.5,
    fontWeight: "500",
    paddingBottom: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
  },
  boxTextarea: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  inputTextarea: {
    minHeight: 80,
    lineHeight: 24,
    paddingTop: 0,
  },
  leading: {
    justifyContent: "center",
  },
  trailing: {
    justifyContent: "center",
  },
  helper: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
    paddingLeft: 4,
  },
});
