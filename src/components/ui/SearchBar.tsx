import { useTheme } from "@/theme";
import { Search, X } from "lucide-react-native";
import React from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Buscar orden, cliente o placas…",
  onClear,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const bg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.6)";

  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.14)"
    : "rgba(255, 255, 255, 0.7)";

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor,
        },
        style,
      ]}
    >
      <Search size={17} color={colors.textMuted} style={styles.searchIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.textStrong }]}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearBtn}
          activeOpacity={0.7}
        >
          <X size={15} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    width: "100%",
    marginVertical: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    lineHeight: 18,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
