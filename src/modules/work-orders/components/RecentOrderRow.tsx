import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Car, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/theme";
import { WorkOrderCardModel } from "../types/work-order.types";

export interface RecentOrderRowProps {
  order: WorkOrderCardModel;
  showDivider?: boolean;
  onPress: () => void;
}

export const RecentOrderRow: React.FC<RecentOrderRowProps> = ({
  order,
  showDivider = true,
  onPress,
}) => {
  const { colors, typography } = useTheme();

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
      <View style={styles.left}>
        <Car size={22} color={colors.brandPrimary} strokeWidth={1.8} />
        <View style={styles.textCol}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            {order.vehicle}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {order.folio} · {order.client}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {order.plate}
          </Text>
        </View>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
