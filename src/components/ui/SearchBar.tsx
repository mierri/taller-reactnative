import { useTheme } from "@/theme";
import { Search, X } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface SearchBarProps {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onPress?: () => void;
  editable?: boolean;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Buscar orden, cliente o placas…",
  onClear,
  onPress,
  editable = true,
  style,
}) => {
  const { colors, typography, radius, isDark } = useTheme();

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  const bg = isDark ? "rgba(27, 42, 33, 0.6)" : "rgba(255, 255, 255, 0.6)";

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: colors.borderCard,
          borderRadius: radius.lg,
        },
        style,
      ]}
    >
      <Search size={20} color={colors.textMuted} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        editable={onPress ? false : editable}
        pointerEvents={onPress ? "none" : undefined}
        style={[
          styles.input,
          typography.bodyLg,
          { color: colors.textStrong, lineHeight: undefined },
        ]}
        textAlignVertical="center"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && !onPress && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearBtn}
          activeOpacity={0.7}
        >
          <X size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressableWrapper}>
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  pressableWrapper: {
    width: "100%",
  },
  container: {
    height: 48,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  clearBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
