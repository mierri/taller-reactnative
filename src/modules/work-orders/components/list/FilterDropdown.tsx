import React, { useEffect, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface FilterDropdownOption {
  key: string;
  label: string;
}

export interface FilterDropdownProps {
  label: string;
  valueLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  options: FilterDropdownOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  valueLabel,
  isOpen,
  onToggle,
  options,
  selectedKey,
  onSelect,
}) => {
  const { colors, radius, typography } = useTheme();
  const [animValue] = useState(() => new Animated.Value(isOpen ? 1 : 0));

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(animValue, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animValue]);

  const chevronRotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const maxHeightAnim = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });

  const borderWidthAnim = animValue.interpolate({
    inputRange: [0, 0.05, 1],
    outputRange: [0, 1, 1],
  });

  const marginTopAnim = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <View style={styles.fieldGroup}>
      <Text style={[typography.labelLg, { color: colors.textLabel }]}>
        {label}
      </Text>

      <TouchableOpacity
        style={[
          styles.selectBox,
          {
            backgroundColor: colors.surfaceInput,
            borderColor: isOpen ? colors.borderFocus : colors.borderInput,
            borderWidth: isOpen ? 2 : 1,
            borderRadius: radius.lg,
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[typography.input, { color: colors.textStrong }]}>
          {valueLabel}
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <ChevronDown size={20} color={colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        pointerEvents={isOpen ? "auto" : "none"}
        style={[
          styles.menuDropdown,
          {
            backgroundColor: colors.surfaceInput,
            borderColor: colors.borderInput,
            borderRadius: radius.md,
            maxHeight: maxHeightAnim,
            opacity: animValue,
            borderWidth: borderWidthAnim,
            marginTop: marginTopAnim,
          },
        ]}
      >
        <ScrollView
          style={styles.dropdownScroll}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.menuItem,
                  isSelected && {
                    backgroundColor: colors.surfaceChipNeutral,
                  },
                ]}
                onPress={() => onSelect(opt.key)}
              >
                <Text
                  style={[
                    typography.bodyLg,
                    {
                      color: isSelected
                        ? colors.brandPrimaryText
                        : colors.textStrong,
                      fontWeight: isSelected ? "600" : "400",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <Check size={16} color={colors.brandPrimaryText} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 8,
    width: "100%",
  },
  selectBox: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuDropdown: {
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: 160,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
