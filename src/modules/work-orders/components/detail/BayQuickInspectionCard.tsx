import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/theme";
import { QuickInspectionState } from "../../types/work-order-detail.types";
import {
  getInspectionStatusColor,
  getInspectionStatusLabel,
} from "../../utils/detail-formatters";

export interface BayQuickInspectionCardProps {
  inspection: QuickInspectionState;
  onToggleItem: (key: keyof QuickInspectionState) => void;
  onToggleAll?: () => void;
}

export const BayQuickInspectionCard: React.FC<BayQuickInspectionCardProps> = ({
  inspection,
  onToggleItem,
  onToggleAll,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const items: {
    key: keyof QuickInspectionState;
    label: string;
    status: QuickInspectionState[keyof QuickInspectionState];
  }[] = [
    { key: "brakes", label: "Frenos", status: inspection.brakes },
    { key: "levels", label: "Niveles", status: inspection.levels },
    { key: "tires", label: "Llantas", status: inspection.tires },
  ];

  const handleHeaderPress = () => {
    if (onToggleAll) {
      onToggleAll();
    } else {
      onToggleItem("brakes");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
          INSPECCIÓN RÁPIDA
        </Text>

        <TouchableOpacity
          onPress={handleHeaderPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Toca para actualizar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        {items.map((item) => {
          const dotColor = getInspectionStatusColor(item.status);
          const statusText = getInspectionStatusLabel(item.status);

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onToggleItem(item.key)}
              activeOpacity={0.75}
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderCard,
                  borderRadius: radius.xl,
                },
                shadows.card,
              ]}
            >
              <View
                style={[
                  styles.statusCircle,
                  {
                    backgroundColor: dotColor,
                  },
                ]}
              />

              <Text
                style={[
                  typography.buttonMd,
                  styles.itemTitle,
                  { color: colors.textStrong },
                ]}
              >
                {item.label}
              </Text>

              <Text
                style={[
                  typography.caption,
                  styles.itemSubtitle,
                  { color: colors.textMuted },
                ]}
              >
                {statusText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 10,
  },
  itemCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 6,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  itemSubtitle: {
    fontSize: 11,
  },
});
