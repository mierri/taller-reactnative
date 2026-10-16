import { Badge } from "@/components";
import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InventoryArticle } from "../types/inventory.types";

export interface PartCardProps {
  article: InventoryArticle;
  onPress?: (article: InventoryArticle) => void;
}

export const PartCard: React.FC<PartCardProps> = ({ article, onPress }) => {
  const { colors, typography, radius, shadows, fonts } = useTheme();

  const isLowStock = article.stock <= article.minStock;
  const badgeLabel = isLowStock ? "Hay que surtir" : "Disponible";
  const badgeFamily = isLowStock ? "warning" : "active";

  const codeAndLocation = [article.sku, article.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(article)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[typography.labelLg, styles.title, { color: colors.textStrong }]}
          numberOfLines={1}
        >
          {article.name}
        </Text>
        <Badge label={badgeLabel} family={badgeFamily} />
      </View>

      {codeAndLocation.length > 0 && (
        <Text
          style={[
            styles.codeText,
            { fontFamily: fonts.mono500, color: colors.textMuted },
          ]}
        >
          {codeAndLocation}
        </Text>
      )}

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.bottomRow}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {article.type === "PARTE_EN_VENTA" ? "Refacción" : "Consumible"} ·
          Mínimo {article.minStock}
        </Text>

        <View style={styles.stockWrap}>
          <Text
            style={[
              styles.stockNumber,
              {
                color: isLowStock
                  ? colors.statusWarningFg
                  : colors.brandPrimaryText,
              },
            ]}
          >
            {article.stock}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {" "}
            en almacén
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
  },
  codeText: {
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: -2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stockWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  stockNumber: {
    fontSize: 16,
    fontWeight: "800",
  },
});
