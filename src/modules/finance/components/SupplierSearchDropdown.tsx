import { useTheme } from "@/theme";
import { Building2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SupplierOption } from "../types/finance.types";

export interface SupplierSearchDropdownProps {
  results: SupplierOption[];
  onSelect: (supplier: SupplierOption) => void;
  visible: boolean;
}

export const SupplierSearchDropdown: React.FC<SupplierSearchDropdownProps> = ({
  results,
  onSelect,
  visible,
}) => {
  const { colors, radius, typography, shadows } = useTheme();

  if (!visible || results.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderInput,
          borderRadius: radius.lg,
        },
        shadows.card,
      ]}
    >
      {results.slice(0, 3).map((supplier, index) => {
        const isLast = index === Math.min(results.length, 3) - 1;

        return (
          <Pressable
            key={supplier.id}
            onPress={() => onSelect(supplier)}
            style={({ pressed }) => [
              styles.item,
              !isLast && {
                borderBottomColor: colors.borderDivider,
                borderBottomWidth: 1,
              },
              {
                backgroundColor: pressed ? colors.surfaceTile : "transparent",
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: colors.surfaceAvatar,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Building2 size={16} color={colors.accentAvatarText} />
            </View>

            <View style={styles.textWrap}>
              <Text
                style={[typography.labelLg, { color: colors.textStrong }]}
                numberOfLines={1}
              >
                {supplier.name}
              </Text>
              {supplier.defaultConcept ? (
                <Text
                  style={[typography.caption, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {supplier.defaultConcept}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
