import { Switch } from "@/components";
import { useTheme } from "@/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { formatCurrency } from "../../utils/detail-formatters";

export interface QuotationTotalsCardProps {
  applyIva: boolean;
  onToggleIva: (val: boolean) => void;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  onDiscountTypePress: () => void;
  onChangeDiscountValue: (val: number) => void;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export const QuotationTotalsCard: React.FC<QuotationTotalsCardProps> = ({
  applyIva,
  onToggleIva,
  discountType,
  discountValue,
  onDiscountTypePress,
  onChangeDiscountValue,
  subtotal,
  taxAmount,
  total,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.totalsCard,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
      ]}
    >
      <View style={styles.ivaRow}>
        <Switch value={applyIva} onValueChange={onToggleIva} />
        <Text
          style={[
            typography.bodyMd,
            styles.ivaLabel,
            { color: colors.textStrong },
          ]}
        >
          Aplicar IVA
        </Text>
      </View>

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.discountRow}>
        <View style={styles.discountColumn}>
          <Text
            style={[
              typography.captionMedium,
              styles.fieldLabel,
              { color: colors.textSecondary },
            ]}
          >
            Tipo de descuento
          </Text>
          <TouchableOpacity
            onPress={onDiscountTypePress}
            activeOpacity={0.7}
            style={[
              styles.selectBox,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.lg,
              },
            ]}
          >
            <Text
              style={[
                typography.bodyMd,
                { color: colors.textStrong, fontSize: 13 },
              ]}
            >
              {discountType === "PERCENT" ? "Porcentaje (%)" : "Cantidad ($)"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.discountColumn}>
          <Text
            style={[
              typography.captionMedium,
              styles.fieldLabel,
              { color: colors.textSecondary },
            ]}
          >
            {discountType === "PERCENT" ? "Descuento · %" : "Descuento · $"}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={discountValue.toString()}
            onChangeText={(text) => {
              const parsed = parseFloat(text) || 0;
              onChangeDiscountValue(parsed);
            }}
            style={[
              styles.inputBox,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.lg,
                color: colors.textStrong,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.summaryLine}>
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Subtotal
        </Text>
        <Text
          style={[
            typography.bodyMd,
            styles.amountText,
            { color: colors.textStrong },
          ]}
        >
          {formatCurrency(subtotal)}
        </Text>
      </View>

      <View style={styles.summaryLine}>
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          IVA (16%)
        </Text>
        <Text
          style={[
            typography.bodyMd,
            styles.amountText,
            { color: colors.textStrong },
          ]}
        >
          {formatCurrency(taxAmount)}
        </Text>
      </View>

      <View
        style={[styles.divider, { backgroundColor: colors.borderDivider }]}
      />

      <View style={styles.totalRow}>
        <Text
          style={[
            typography.headingMd,
            styles.totalLabel,
            { color: colors.textStrong },
          ]}
        >
          Total
        </Text>
        <View style={styles.totalAmountContainer}>
          <Text
            style={[
              typography.headingXl,
              styles.totalValue,
              { color: colors.brandPrimary },
            ]}
          >
            {formatCurrency(total)}
          </Text>
          <Text
            style={[
              typography.captionMedium,
              styles.currencyLabel,
              { color: colors.textMuted },
            ]}
          >
            MXN
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  totalsCard: {
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  ivaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ivaLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  discountRow: {
    flexDirection: "row",
    gap: 12,
  },
  discountColumn: {
    flex: 1,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
  },
  selectBox: {
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputBox: {
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  summaryLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  currencyLabel: {
    fontSize: 11,
  },
});
