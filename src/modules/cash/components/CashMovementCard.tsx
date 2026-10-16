import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { ArrowLeftRight, CreditCard, Wallet } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CashMovementItem } from "../types/cash.types";

export interface CashMovementCardProps {
  movement: CashMovementItem;
}

const methodLabels: Record<CashMovementItem["paymentMethod"], string> = {
  CARD: "Tarjeta",
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
};

export const CashMovementCard: React.FC<CashMovementCardProps> = ({
  movement,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const IconComponent =
    movement.paymentMethod === "CARD"
      ? CreditCard
      : movement.paymentMethod === "TRANSFER"
        ? ArrowLeftRight
        : Wallet;

  return (
    <View
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
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: colors.surfaceTile,
            borderRadius: radius.lg,
          },
        ]}
      >
        <IconComponent size={20} color={colors.textSecondary} strokeWidth={2} />
      </View>

      <View style={styles.infoColumn}>
        <Text style={[typography.titleCard, { color: colors.textStrong }]}>
          {movement.clientName}
        </Text>
        <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>
          {movement.workOrderCode} · {methodLabels[movement.paymentMethod]}
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {movement.createdAt}
        </Text>
      </View>

      <View style={styles.amountColumn}>
        <Text style={[typography.titleCard, { color: colors.brandPrimary }]}>
          +{formatCurrency(movement.amount)}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Neto {formatCurrency(movement.netAmount)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  infoColumn: {
    flex: 1,
    gap: 2,
  },
  amountColumn: {
    alignItems: "flex-end",
    gap: 4,
  },
});

